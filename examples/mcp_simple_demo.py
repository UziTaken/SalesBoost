#!/usr/bin/env python3
"""
MCP Server 功能演示脚本

演示 SalesBoost MCP Server 的核心功能：
1. MCP Server 初始化
2. 工具列表
3. 资源访问
4. 提示词模板
5. 消息处理

Usage:
    python examples/mcp_simple_demo.py
"""

import asyncio
import json
import logging
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

from app.mcp.server import SalesBoostMCPServer
from app.mcp.protocol import (
    MCPPrompt,
    MCPPromptResult,
    MCPResource,
    MCPResourceContent,
    MCPTool,
    MCPToolResult,
    ResourceType,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


class DemoHandler:
    """演示用的 MCP Handler"""

    async def list_tools(self):
        """列出可用工具"""
        tools = [
            MCPTool(
                name="knowledge_retriever",
                description="检索销售知识库",
                input_schema={
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "搜索查询"
                        }
                    },
                    "required": ["query"]
                }
            ),
            MCPTool(
                name="profile_reader",
                description="读取用户档案",
                input_schema={
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "description": "用户ID"
                        }
                    },
                    "required": ["user_id"]
                }
            ),
            MCPTool(
                name="price_calculator",
                description="计算产品价格",
                input_schema={
                    "type": "object",
                    "properties": {
                        "base_price": {"type": "number"},
                        "quantity": {"type": "integer"}
                    },
                    "required": ["base_price", "quantity"]
                }
            )
        ]
        return tools

    async def call_tool(self, name, arguments):
        """执行工具"""
        logger.info(f"调用工具: {name} 参数: {arguments}")

        if name == "knowledge_retriever":
            return MCPToolResult(
                content=f"[知识检索结果] 关于 '{arguments['query']}' 的信息：\n- 这是一个示例知识库响应\n- 包含相关的销售资料和最佳实践",
                is_error=False
            )
        elif name == "profile_reader":
            return MCPToolResult(
                content=f"[用户档案] 用户ID: {arguments['user_id']}\n姓名: 张三\n职位: 采购经理\n公司: ABC公司\n预算: $50,000",
                is_error=False
            )
        elif name == "price_calculator":
            total = arguments["base_price"] * arguments["quantity"]
            return MCPToolResult(
                content=f"[价格计算] 基础价格: ${arguments['base_price']}\n数量: {arguments['quantity']}\n总价: ${total:.2f}",
                is_error=False
            )
        else:
            return MCPToolResult(
                content=f"未知工具: {name}",
                is_error=True
            )

    async def list_resources(self):
        """列出可用资源"""
        resources = [
            MCPResource(
                uri="salesboost://knowledge/sales_process",
                name="销售流程",
                description="标准销售流程指南",
                mime_type="text/plain"
            ),
            MCPResource(
                uri="salesboost://knowledge/objection_handling",
                name="异议处理",
                description="常见客户异议处理技巧",
                mime_type="text/plain"
            ),
            MCPResource(
                uri="salesboost://profile/123",
                name="客户档案",
                description="客户基本信息",
                mime_type="application/json"
            )
        ]
        return resources

    async def read_resource(self, uri):
        """读取资源"""
        logger.info(f"读取资源: {uri}")

        if "sales_process" in uri:
            return MCPResourceContent(
                uri=uri,
                mime_type="text/plain",
                text="# 销售流程指南\n\n1. 潜在客户识别\n2. 初步接触\n3. 需求分析\n4. 方案展示\n5. 异议处理\n6. 谈判与成交\n7. 售后跟进"
            )
        elif "objection_handling" in uri:
            return MCPResourceContent(
                uri=uri,
                mime_type="text/plain",
                text="# 异议处理技巧\n\n## 价格异议\n- 强调价值\n- 展示ROI\n- 灵活付款方案\n\n## 时间异议\n- 强调紧迫性\n- 展示延迟成本\n- 分阶段实施"
            )
        elif "profile" in uri:
            return MCPResourceContent(
                uri=uri,
                mime_type="application/json",
                text=json.dumps({
                    "user_id": "123",
                    "name": "李四",
                    "company": "XYZ Corp",
                    "title": "CTO",
                    "budget": 100000,
                    "timeline": "Q3 2026"
                }, indent=2, ensure_ascii=False)
            )
        else:
            raise ValueError(f"资源未找到: {uri}")

    async def list_prompts(self):
        """列出可用提示词"""
        prompts = [
            MCPPrompt(
                name="objection_handling",
                description="处理客户异议",
                arguments=[
                    {"name": "objection", "description": "客户提出的异议", "required": True},
                    {"name": "context", "description": "上下文信息", "required": False}
                ]
            ),
            MCPPrompt(
                name="discovery_questions",
                description="生成发现性问题",
                arguments=[
                    {"name": "industry", "description": "行业", "required": True},
                    {"name": "company_size", "description": "公司规模", "required": False}
                ]
            ),
            MCPPrompt(
                name="value_proposition",
                description="生成价值主张",
                arguments=[
                    {"name": "product", "description": "产品名称", "required": True},
                    {"name": "customer_pain", "description": "客户痛点", "required": True}
                ]
            )
        ]
        return prompts

    async def get_prompt(self, name, arguments=None):
        """获取提示词"""
        logger.info(f"获取提示词: {name} 参数: {arguments}")

        args = arguments or {}

        if name == "objection_handling":
            return MCPPromptResult(
                messages=[{
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": f"""请帮我处理这个客户异议：

异议：{args.get('objection', '价格太高')}

上下文：{args.get('context', '销售演示阶段')}

请提供：
1. 共情回应
2. 提问澄清
3. 价值呈现
4. 下一步行动"""
                    }
                }]
            )
        elif name == "discovery_questions":
            return MCPPromptResult(
                messages=[{
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": f"""请为以下行业生成发现性问题：

行业：{args.get('industry', 'SaaS')}
公司规模：{args.get('company_size', '500-1000人')}

请生成5-8个深入的问题，帮助了解：
1. 当前挑战
2. 业务目标
3. 决策流程
4. 预算范围
5. 时间线"""
                    }
                }]
            )
        elif name == "value_proposition":
            return MCPPromptResult(
                messages=[{
                    "role": "user",
                    "content": {
                        "type": "text",
                        "text": f"""请为以下场景生成价值主张：

产品：{args.get('product', '销售管理系统')}
客户痛点：{args.get('customer_pain', '销售团队效率低下')}

请生成：
1. 核心价值声明
2. 支持论据（3点）
3. 具体场景示例
4. ROI数据"""
                    }
                }]
            )
        else:
            raise ValueError(f"提示词未找到: {name}")


class MCPAdapter:
    """将 DemoHandler 适配为 MCPServerHandler"""

    def __init__(self, handler: DemoHandler):
        self._handler = handler

    async def list_tools(self):
        return await self._handler.list_tools()

    async def call_tool(self, name, arguments):
        return await self._handler.call_tool(name, arguments)

    async def list_resources(self):
        return await self._handler.list_resources()

    async def read_resource(self, uri):
        return await self._handler.read_resource(uri)

    async def list_prompts(self):
        return await self._handler.list_prompts()

    async def get_prompt(self, name, arguments=None):
        return await self._handler.get_prompt(name, arguments)


async def demo_server_initialization():
    """演示 1: MCP Server 初始化"""
    logger.info("=" * 70)
    logger.info("演示 1: MCP Server 初始化")
    logger.info("=" * 70)

    # 创建 handler 和 adapter
    demo_handler = DemoHandler()
    handler_adapter = MCPAdapter(demo_handler)

    # 创建 MCP server
    server = SalesBoostMCPServer(
        name="salesboost-mcp",
        version="1.0.0",
        handler=handler_adapter
    )

    logger.info("\n✓ MCP Server 已创建")
    logger.info(f"  名称: {server.name}")
    logger.info(f"  版本: {server.version}")
    logger.info(f"  能力: {server.server_info.capabilities}")

    return server


async def demo_tools(server):
    """演示 2: 工具功能"""
    logger.info("\n" + "=" * 70)
    logger.info("演示 2: 工具功能")
    logger.info("=" * 70)

    # 列出工具
    logger.info("\n--- 可用工具 ---")
    tools_request = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "tools/list",
        "params": {}
    }

    response = await server.handle_request(tools_request)
    tools = response["result"]["tools"]

    logger.info(f"✓ 找到 {len(tools)} 个工具:")
    for tool in tools:
        logger.info(f"  - {tool['name']}: {tool['description']}")

    # 调用工具
    logger.info("\n--- 调用工具 ---")

    tool_calls = [
        {
            "name": "knowledge_retriever",
            "arguments": {"query": "SaaS销售策略"}
        },
        {
            "name": "profile_reader",
            "arguments": {"user_id": "123"}
        },
        {
            "name": "price_calculator",
            "arguments": {"base_price": 100, "quantity": 50}
        }
    ]

    for call in tool_calls:
        request = {
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": call
        }
        response = await server.handle_request(request)
        result = response["result"]

        logger.info(f"\n✓ 工具调用成功: {call['name']}")
        logger.info(f"  结果: {result['content']}")


async def demo_resources(server):
    """演示 3: 资源功能"""
    logger.info("\n" + "=" * 70)
    logger.info("演示 3: 资源功能")
    logger.info("=" * 70)

    # 列出资源
    logger.info("\n--- 可用资源 ---")
    request = {
        "jsonrpc": "2.0",
        "id": 3,
        "method": "resources/list",
        "params": {}
    }

    response = await server.handle_request(request)
    resources = response["result"]["resources"]

    logger.info(f"✓ 找到 {len(resources)} 个资源:")
    for resource in resources:
        logger.info(f"  - {resource['name']}: {resource['description']}")
        logger.info(f"    URI: {resource['uri']}")

    # 读取资源
    logger.info("\n--- 读取资源 ---")

    uris = [
        "salesboost://knowledge/sales_process",
        "salesboost://knowledge/objection_handling",
        "salesboost://profile/123"
    ]

    for uri in uris:
        request = {
            "jsonrpc": "2.0",
            "id": 4,
            "method": "resources/read",
            "params": {"uri": uri}
        }
        response = await server.handle_request(request)
        content = response["result"]["contents"][0]

        logger.info(f"\n✓ 读取资源: {uri}")
        logger.info(f"  内容类型: {content['mime_type']}")
        logger.info(f"  内容:\n{content['text']}")


async def demo_prompts(server):
    """演示 4: 提示词功能"""
    logger.info("\n" + "=" * 70)
    logger.info("演示 4: 提示词功能")
    logger.info("=" * 70)

    # 列出提示词
    logger.info("\n--- 可用提示词 ---")
    request = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "prompts/list",
        "params": {}
    }

    response = await server.handle_request(request)
    prompts = response["result"]["prompts"]

    logger.info(f"✓ 找到 {len(prompts)} 个提示词:")
    for prompt in prompts:
        logger.info(f"  - {prompt['name']}: {prompt['description']}")
        logger.info(f"    参数: {', '.join([arg['name'] for arg in prompt['arguments']])}")

    # 获取提示词
    logger.info("\n--- 获取提示词 ---")

    prompt_requests = [
        {
            "name": "objection_handling",
            "arguments": {
                "objection": "价格太高了",
                "context": "谈判阶段"
            }
        },
        {
            "name": "discovery_questions",
            "arguments": {
                "industry": "制造业",
                "company_size": "1000-5000人"
            }
        }
    ]

    for req in prompt_requests:
        request = {
            "jsonrpc": "2.0",
            "id": 6,
            "method": "prompts/get",
            "params": req
        }
        response = await server.handle_request(request)
        result = response["result"]

        logger.info(f"\n✓ 获取提示词: {req['name']}")
        logger.info(f"  参数: {req.get('arguments', {})}")
        logger.info(f"  生成消息数: {len(result['messages'])}")
        logger.info(f"  消息内容:\n{result['messages'][0]['content']['text']}")


async def demo_complete_workflow(server):
    """演示 5: 完整工作流"""
    logger.info("\n" + "=" * 70)
    logger.info("演示 5: 完整工作流 - 销售场景")
    logger.info("=" * 70)

    logger.info("\n场景: SDR 需要为新客户准备销售材料")
    logger.info("客户: ABC公司 (制造业, 1000-5000人)\n")

    # Step 1: 获取客户信息
    logger.info("--- Step 1: 获取客户信息 ---")
    request = {
        "jsonrpc": "2.0",
        "id": 7,
        "method": "tools/call",
        "params": {
            "name": "profile_reader",
            "arguments": {"user_id": "123"}
        }
    }
    response = await server.handle_request(request)
    logger.info(f"✓ {response['result']['content']}")

    # Step 2: 检索相关知识
    logger.info("\n--- Step 2: 检索销售知识 ---")
    request = {
        "jsonrpc": "2.0",
        "id": 8,
        "method": "tools/call",
        "params": {
            "name": "knowledge_retriever",
            "arguments": {"query": "制造业销售策略"}
        }
    }
    response = await server.handle_request(request)
    logger.info(f"✓ {response['result']['content']}")

    # Step 3: 读取资源
    logger.info("\n--- Step 3: 读取销售流程资源 ---")
    request = {
        "jsonrpc": "2.0",
        "id": 9,
        "method": "resources/read",
        "params": {"uri": "salesboost://knowledge/sales_process"}
    }
    response = await server.handle_request(request)
    content = response["result"]["contents"][0]["text"]
    logger.info("✓ 获取销售流程指南")
    logger.info(f"  {content.split(chr(10))[0]}")  # 只显示第一行

    # Step 4: 生成发现性问题
    logger.info("\n--- Step 4: 生成发现性问题 ---")
    request = {
        "jsonrpc": "2.0",
        "id": 10,
        "method": "prompts/get",
        "params": {
            "name": "discovery_questions",
            "arguments": {
                "industry": "制造业",
                "company_size": "1000-5000人"
            }
        }
    }
    response = await server.handle_request(request)
    logger.info("✓ 生成发现性问题")
    logger.info(f"  {response['result']['messages'][0]['content']['text'][:150]}...")

    logger.info("\n✓ 工作流完成！")
    logger.info("\n--- 总结 ---")
    logger.info("  1. 获取客户档案 ✓")
    logger.info("  2. 检索相关知识 ✓")
    logger.info("  3. 读取流程资源 ✓")
    logger.info("  4. 生成提示词 ✓")
    logger.info("  所有功能正常工作！")


async def main():
    """运行所有演示"""
    try:
        logger.info("\n" + "=" * 70)
        logger.info("SalesBoost MCP Server 功能演示")
        logger.info("=" * 70)

        # 演示 1: 初始化
        server = await demo_server_initialization()

        # 演示 2: 工具
        await demo_tools(server)

        # 演示 3: 资源
        await demo_resources(server)

        # 演示 4: 提示词
        await demo_prompts(server)

        # 演示 5: 完整工作流
        await demo_complete_workflow(server)

        logger.info("\n" + "=" * 70)
        logger.info("所有演示完成! 🎉")
        logger.info("=" * 70)

        logger.info("\nMCP Server 核心功能:")
        logger.info("  ✓ 工具调用 (Tools)")
        logger.info("  ✓ 资源访问 (Resources)")
        logger.info("  ✓ 提示词模板 (Prompts)")
        logger.info("  ✓ 消息处理 (JSON-RPC)")
        logger.info("  ✓ 完整工作流集成")

        logger.info("\n这就是 MCP Server 的核心能力！")

    except Exception as e:
        logger.error(f"演示失败: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
