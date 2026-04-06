# AI 伴侣 MVP 技术选型与技术栈（CN First）

## Summary
- 基于 [PRDV0.1.md](/D:/Projects/AI/AiCompanion/PRDV0.1.md) 和 [UX_v0.1.md](/D:/Projects/AI/AiCompanion/UX_v0.1.md)，首版定为 `中国大陆单区域`、`Android first`、`KMP 预留 iOS`、`文字聊天`、`记忆 + 主动关心 + 关系连续性`。
- 不再为首版做双区域部署或国际化运行时切换；国际化只保留扩展接口，不保留双环境复杂度。
- 总体方案定为：`KMP 客户端 + Kotlin 后端模块化单体 + 阿里云北京区模型/数据库/计算资源 + 本地通知驱动的主动问候`。

## 技术栈
- 客户端：`Kotlin Multiplatform` 共享 `domain/data/network`，Android 端使用 `Jetpack Compose + Material 3`。
- 客户端基础库：`Ktor Client`、`SQLDelight`、`Koin`、`kotlinx.serialization`、`Coroutines/StateFlow`。
- 后端：`Kotlin + Spring Boot`，采用模块化单体，固定模块为 `chat`、`memory`、`greeting`、`safety`、`profile`、`provider`。
- 流式对话：后端使用 `SSE` 向客户端输出流式回复。
- 数据层：`阿里云 RDS PostgreSQL` + `pgvector`；默认使用 `HNSW` 索引，只有在写入压力或内存成本不合适时才退回 `IVFFlat`。
- 模型层：首版只实现 `阿里云百炼 / DashScope（北京）`。
  - 主对话：`qwen-plus`
  - 低成本抽取/摘要：`qwen-flash`
  - 向量：`text-embedding-v4`，默认 `1024` 维
  - 安全：`阿里云内容安全/生成内容流式审核`
- 主动问候：服务端用 `JobRunr` 生成待回流问候；Android 端用 `WorkManager + Notification` 拉取并展示本地通知。
- 部署：`阿里云 ECS + Docker Compose + Nginx` 部署后端，数据库使用托管 `RDS PostgreSQL`。`OSS` 不进入首版必需栈。

## 关键接口与边界
- 共享模块固定为 `shared-core`、`shared-data`、`shared-domain`、`androidApp`；后续新增 `iosApp` 时不改共享层契约。
- provider 接口固定为：
  - `ChatProvider`
  - `EmbeddingProvider`
  - `SafetyProvider`
  首版只实现 `AliyunProvider`，但接口命名保持通用，供后续国际化扩展。
- API 固定为：
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
- 记忆模型固定为 `长期偏好`、`重要事件`、`在意的人`、`近期困扰` 四类；每条记忆必须带 `source_message_id`、`confidence`、`why_saved`，支撑“为什么记得这件事”。
- 主动问候链路固定为：
  - 服务端判定问候时机并落库 `inbox_message`
  - App 启动或后台周期任务拉取 `pending inbox`
  - 客户端显示本地通知或会话内问候卡片  
  首版不接入厂商推送或第三方推送平台。

## Test Plan
- 产品流程：首次建联后能在后续聊天自然提及兴趣和近期在意的事；隔天回访能续聊；长时间未访问能收到上下文相关问候；删除记忆后不再引用；高风险情绪内容触发克制式响应。
- 技术验证：Android 离线重进可恢复最近线程；SSE 中断可重连；记忆检索采用 `近期消息 + 显式记忆 + 向量召回`；WorkManager 链路接受非精确触发；未来替换第二家模型供应商时不改 API 合同。
- 范围约束：首版不做语音、多角色、登录、多端同步、商业化、厂商推送。

## Assumptions
- 默认云与模型供应商选 `阿里云北京地域`；如果后续改为腾讯云或火山引擎，只替换部署与 provider 层，不改客户端和业务模块边界。
- 主动问候在 v1 采用 best-effort 方案；`WorkManager` 受系统电量优化影响，触发时间允许落在时间窗内，不追求精确到分钟。
- 国际化是二期扩展，只保留 provider 抽象，不保留双区域 profile、双套配置和双地部署。
- 参考资料：[Bailian OpenAI 兼容接口](https://help.aliyun.com/zh/model-studio/compatibility-of-openai-with-dashscope)、[Bailian API Key 与北京 Base URL](https://help.aliyun.com/zh/model-studio/get-api-key)、[text-embedding-v4](https://help.aliyun.com/zh/model-studio/text-embedding-synchronous-api)、[RDS PostgreSQL pgvector](https://help.aliyun.com/zh/rds/apsaradb-rds-for-postgresql/pgvector-use-guide)、[WorkManager](https://developer.android.com/reference/androidx/work/PeriodicWorkRequest)、[Kotlin Multiplatform](https://developer.android.com/kotlin/multiplatform)、[Jetpack Compose](https://developer.android.com/develop/ui/compose/documentation)、[Spring Boot Kotlin](https://docs.spring.io/spring-boot/reference/features/kotlin.html)、[KMP + Ktor + SQLDelight](https://kotlinlang.org/docs/multiplatform/multiplatform-ktor-sqldelight.html)、[Koin KMP](https://insert-koin.io/docs/reference/koin-core/kmp-setup/)、[JobRunr Spring Boot](https://www.jobrunr.io/en/documentation/configuration/spring/)、[阿里云生成内容流式审核](https://help.aliyun.com/document_detail/2980054.html)
