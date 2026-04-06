# AI 伴侣 App MVP 详细开发文档 v0.1

## Summary
- 文档依据 [PRDV0.1.md](D:/Projects/AI/AiCompanion/PRDV0.1.md)、[UX_v0.1.md](D:/Projects/AI/AiCompanion/UX_v0.1.md)、[TechStack_v0.1.md](D:/Projects/AI/AiCompanion/TechStack_v0.1.md) 与当前原型结构，产出 1 份可直接指导客户端、后端、测试协作的 `DevDoc_v0.1.md`。
- 产品范围仍锁定为：`中国大陆单区域`、`Android first`、`匿名用户`、`文字聊天`、`记忆 + 主动关心 + 关系连续性`。
- 在原方案基础上新增一项平台能力：`模型动态配置`，且已锁定为 `运营热切换`、`按能力拆分配置`。客户端无模型选择入口，所有切换由服务端完成，App 无感知。

## Key Changes
### 1. 总体架构
- 客户端采用 `Kotlin Multiplatform + Android Jetpack Compose`，负责 Onboarding、聊天、会话、记忆、我的 5 个核心页面，使用 `Ktor Client + SQLDelight + Koin + Coroutines/StateFlow`。
- 后端采用 `Kotlin + Spring Boot` 模块化单体，模块固定为 `profile`、`chat`、`memory`、`greeting`、`safety`、`provider`、`model-config`。
- 基础设施固定为 `阿里云北京`：`ECS + Docker Compose + Nginx + RDS PostgreSQL + pgvector`，模型接入固定经由 `AliyunProvider` 访问 DashScope。
- 通信模式固定为 `REST + SSE`：业务读写走 REST，聊天回复走 `POST /v1/chat/stream` 的 SSE。

### 2. 核心业务与页面实现
- Onboarding 固定为 4 步：欢迎、称呼、兴趣、近期在意的事；完成后创建匿名会话、写入用户资料、生成首批显式记忆，并进入聊天页。
- 聊天页支持 6 类状态：首次空态、常态、等待回复、记忆触发态、主动问候承接态、失败态；消息流中支持显示“为什么提到这件事”的记忆提示条。
- 会话页展示历史线程列表，按 `last_active_at` 倒序；点入后恢复原上下文继续聊，不新建伪新会话。
- 记忆页展示记忆卡片，支持查看来源、编辑、删除、删除影响提示；删除后后续对话不得再引用该记忆。
- 我的页只保留称呼、通知开关、隐私与安全说明、清空数据并重置关系；不加入模型选择、装扮、会员、分享等能力。
- 主动问候只保留两条链路：固定时间问候、长时间未访问回流；文案必须结合用户真实上下文，禁止模板化寒暄。
- 高风险内容统一走 `safety` 模块降级处理，语气保持克制、现实导向、非依赖强化。

### 3. 数据模型、接口与动态配置
- 匿名身份模型：`AnonymousSession { id, device_id, token, created_at, last_seen_at }`。
- 用户资料模型：`UserProfile { display_name, interests[], recent_concern, notification_enabled, timezone, created_at, updated_at }`。
- 会话模型：`Conversation { id, title, last_message_preview, last_active_at }`。
- 消息模型：`Message { id, conversation_id, role, content, created_at, memory_triggered, memory_source_id }`。
- 记忆模型：`Memory { id, type, content, source_message_id, confidence, why_saved, created_at, updated_at }`，`type` 只允许 `长期偏好 / 重要事件 / 在意的人 / 近期困扰`。
- 主动问候模型：`InboxMessage { id, kind, title, content, related_conversation_id, related_memory_id, status, scheduled_at, opened_at }`，`kind` 只允许 `scheduled_greeting / re_engagement`。
- 新增模型配置模型：`ModelConfig { id, capability, provider, model_id, base_url, embedding_dimension, temperature, max_tokens, timeout_ms, enabled, version, is_active, updated_at, updated_by }`。
- `capability` 固定为 4 类并独立配置：`chat_primary`、`chat_summary`、`embedding`、`safety`。首版不做更细粒度的按场景自由组合。
- 配置数据存储在 PostgreSQL，服务端通过 `model-config` 模块维护内存缓存；默认每 `30s` 自动刷新一次，同时提供手动刷新接口。若新配置不可用，则继续使用 `last known good config`，不影响在线服务。
- provider 接口固定为：
  - `ChatProvider.generateStream(request, modelConfig)`
  - `EmbeddingProvider.embed(text, modelConfig)`
  - `SafetyProvider.review(input, modelConfig)`
- `AliyunProvider` 不再硬编码模型名，统一从 `ModelConfig` 读取 `model_id/base_url/timeout` 等参数。
- 面向 App 的业务 API 保持不变：
  - `POST /v1/sessions/anonymous`
  - `POST /v1/chat/stream`
  - `GET /v1/conversations`
  - `GET /v1/conversations/{id}`
  - `GET /v1/memories`
  - `PATCH /v1/memories/{id}`
  - `DELETE /v1/memories/{id}`
  - `GET /v1/profile`
  - `PATCH /v1/profile`
  - `GET /v1/inbox/pending`
  - `POST /v1/inbox/{id}/opened`
- 新增仅供运营/研发使用的内部配置接口，不暴露给 App：
  - `GET /internal/v1/model-configs`
  - `PUT /internal/v1/model-configs/{capability}/active`
  - `POST /internal/v1/model-configs/reload`
- 内部接口需使用独立运维凭证或内网保护；首版不做后台管理 Web 页面，以接口和数据库审计满足配置需求。
- 数据表固定为：`anonymous_session`、`user_profile`、`conversation`、`message`、`memory`、`memory_embedding`、`inbox_message`、`safety_event`、`model_config`。

### 4. 关键链路规则
- 聊天链路按“最近消息 + 显式记忆 + 向量召回”拼装上下文；主对话使用 `chat_primary` 配置，摘要/抽取使用 `chat_summary` 配置，向量写入与召回使用 `embedding` 配置，审核使用 `safety` 配置。
- 记忆抽取只保存高价值信息，不把日常碎片全部入库；每条记忆必须写入 `source_message_id`、`confidence`、`why_saved`。
- 记忆删除采用硬删除，并同步清理 `memory_embedding` 与后续引用资格。
- 主动问候由服务端用 `JobRunr` 生成 `inbox_message`，Android 通过 `WorkManager + Notification` 周期拉取并展示；点击后回流聊天页并上报 `opened`。
- 模型热切换不要求客户端重启；新请求直接走新配置，进行中的 SSE 请求继续使用启动时绑定的配置版本，避免流中模型切换。
- 配置切换必须支持回滚：同一 `capability` 仅允许 1 条 `is_active = true`，切换时保存版本历史，出错时一键切回上一版本。
- v1 不做按用户分流、A/B 实验、灰度百分比和用户侧模型偏好，仅做平台级全量切换。

## Test Plan
- 产品验收：首次建联后可在后续聊天自然提及兴趣和近期在意的事；隔天回访能续聊；长时间未访问能收到上下文相关问候；删除记忆后不再引用；高风险内容走克制式响应。
- 客户端验收：Onboarding 支持跳过；聊天页覆盖空态、加载态、SSE 失败态、主动问候承接态；会话排序正确；记忆编辑与删除反馈明确；断网重进可查看最近缓存内容。
- 后端验收：匿名会话可重复恢复；消息、记忆、问候、审核日志正确落库；向量召回与显式记忆召回可联合工作；删除记忆后索引同步清理。
- 动态配置验收：在不重启服务的情况下切换 `chat_primary / chat_summary / embedding / safety` 任一能力的模型配置，新请求立即生效；正在进行中的请求不中断；无效配置不会污染线上流量；可快速回滚到上一版本。
- 兼容性验收：替换第二家模型供应商时不改 App API 合同；仅新增 provider 实现与对应 `ModelConfig.provider` 解析逻辑。
- 安全验收：内部配置接口不可被 App 直接访问；模型配置变更具备时间、操作者、版本审计信息。

## Assumptions
- `prototype/` 仅作为交互参考，不作为正式客户端代码基线；正式客户端直接按 KMP + Compose 实现。
- 匿名模式下不引入账号系统，只保证单设备匿名连续性；清空数据视为彻底重置关系。
- 主动问候采用 best-effort，不承诺分钟级精确送达。
- 动态配置首版只做服务端平台级热切换，不做终端用户选模型。
- 首版默认模型供应商仍是 `AliyunProvider`，但所有模型名、超时、参数都必须从 `model_config` 读取，禁止业务代码硬编码。
