# 📁 SalesBoost Project Structure

**Last Updated**: 2026-02-05
**Status**: ✅ Reorganized to World-Class Standards

---

## 🎯 Overview

This document describes the complete project structure of SalesBoost, organized according to world-class open source project standards.

---

## 📂 Directory Structure

```
SalesBoost/
├── 📁 app/                          # Main application package
│   ├── 📁 agents/                   # Multi-agent system
│   │   ├── 📁 autonomous/           # Autonomous agents (SDR, etc.)
│   │   ├── 📁 practice/             # Practice agents (NPC Simulator)
│   │   ├── 📁 simulation/           # Simulation orchestrator
│   │   ├── 📁 memory/               # Agent memory system ⭐ NEW
│   │   ├── 📁 rl/                   # Reinforcement learning ⭐ NEW
│   │   ├── 📁 emotion/              # Emotion models ⭐ NEW
│   │   └── 📁 roles/                # Base agent classes
│   │
│   ├── 📁 ai_core/                  # AI core components ⭐ NEW
│   │   ├── 📁 constitutional/       # Constitutional AI 2.0 ⭐ 2026
│   │   ├── 📁 curriculum/           # Adaptive curriculum
│   │   └── 📁 rlaif/                # RLAIF pipeline
│   │
│   ├── 📁 api/                      # API endpoints
│   │   ├── 📁 v1/                   # API v1
│   │   └── 📁 websocket/            # WebSocket handlers
│   │
│   ├── 📁 cognitive/                # Cognitive services
│   │   ├── 📁 intent/               # Intent classification
│   │   ├── 📁 sentiment/            # Sentiment analysis
│   │   └── 📁 objection/            # Objection detection
│   │
│   ├── 📁 engine/                   # Core engine
│   │   ├── 📁 coordinator/          # Agent coordination
│   │   └── 📁 intent/               # Intent routing
│   │
│   ├── 📁 infra/                    # Infrastructure
│   │   ├── 📁 gateway/              # LLM gateway
│   │   ├── 📁 llm/                  # LLM infrastructure
│   │   │   └── 📁 moe/              # Mixture of Experts ⭐ 2026
│   │   ├── 📁 search/               # Search services
│   │   └── 📁 resilience/           # Resilience patterns
│   │
│   ├── 📁 mcp/                      # Model Context Protocol
│   │   ├── orchestrator.py          # MCP orchestrator
│   │   ├── dynamic_orchestrator.py  # Enhanced orchestrator
│   │   ├── learning_engine.py       # Learning engine
│   │   └── cache_manager.py         # Cache manager
│   │
│   ├── 📁 monitoring/               # Monitoring & observability
│   ├── 📁 retrieval/                # RAG & retrieval
│   ├── 📁 schemas/                  # Data schemas
│   ├── 📁 services/                 # Business services
│   └── 📁 tools/                    # Agent tools
│
├── 📁 docs/                         # Documentation
│   ├── 📁 guides/                   # User guides ⭐ ORGANIZED
│   │   ├── mcp-2026-complete.md     # MCP 2026 guide
│   │   └── mcp-a2a-integration.md   # MCP+A2A guide
│   │
│   ├── 📁 reports/                  # Implementation reports ⭐ ORGANIZED
│   │   ├── integration-complete.md  # Integration report
│   │   ├── deployment-report.md     # Deployment report
│   │   └── agent-enhancement-complete.md
│   │
│   ├── 📁 architecture/             # Architecture docs
│   │   └── ARCHITECTURE.md          # System architecture
│   │
│   ├── 📁 api/                      # API documentation
│   └── README.md                    # Docs index
│
├── 📁 scripts/                      # Utility scripts
│   ├── 📁 ops/                      # Operations scripts
│   │   ├── reorganize_project_v2.py # Project reorganizer ⭐ NEW
│   │   └── setup_dev.py             # Dev environment setup
│   │
│   ├── 📁 ingestion/                # Data ingestion
│   ├── 📁 maintenance/              # Maintenance scripts
│   ├── 📁 deployment/               # Deployment scripts
│   │
│   └── 📁 archive/                  # Historical scripts ⭐ ARCHIVED
│       ├── 📁 maintenance/          # Archived maintenance scripts
│       └── 📁 deployment/           # Archived deployment scripts
│
├── 📁 tests/                        # Test suite
│   ├── 📁 unit/                     # Unit tests
│   │   ├── 📁 api/
│   │   ├── 📁 cognitive/
│   │   └── 📁 infra/
│   │
│   ├── 📁 integration/              # Integration tests
│   └── 📁 e2e/                      # End-to-end tests
│
├── 📁 examples/                     # Example code
│   ├── 📁 demos/                    # Demo scripts
│   └── 📁 notebooks/                # Jupyter notebooks
│
├── 📁 config/                       # Configuration files
│   ├── development.yaml
│   ├── production.yaml
│   └── test.yaml
│
├── 📁 deployment/                   # Deployment configs
│   ├── 📁 docker/                   # Docker files
│   ├── 📁 kubernetes/               # K8s manifests
│   └── 📁 terraform/                # Infrastructure as code
│
├── 📄 README.md                     # Project README
├── 📄 CHANGELOG.md                  # Change log
├── 📄 CONTRIBUTING.md               # Contribution guide
├── 📄 CODE_OF_CONDUCT.md            # Code of conduct
├── 📄 SECURITY.md                   # Security policy
├── 📄 LICENSE                       # License file
├── 📄 pyproject.toml                # Python project config
├── 📄 requirements.txt              # Python dependencies
└── 📄 .gitignore                    # Git ignore rules
```

---

## 🎯 Key Improvements

### ✅ 1. Documentation Organization
- **Before**: 50+ files scattered in root and docs/
- **After**: Organized into `guides/`, `reports/`, `architecture/`
- **Impact**: Easy to find relevant documentation

### ✅ 2. Historical Scripts Archived
- **Before**: 37 `week*` and `phase*` scripts cluttering maintenance/
- **After**: Moved to `scripts/archive/`
- **Impact**: Clean, maintainable scripts directory

### ✅ 3. Missing __init__.py Added
- **Before**: 5 directories missing `__init__.py`
- **After**: All Python packages properly initialized
- **Impact**: Proper Python package structure

### ✅ 4. Directory READMEs Created
- **Before**: No README in subdirectories
- **After**: README in all major directories
- **Impact**: Clear purpose for each directory

---

## 📚 Directory Purposes

### `/app` - Main Application
The core application code, organized by functionality.

**Key Subdirectories**:
- `agents/` - Multi-agent system implementation
- `ai_core/` - Advanced AI algorithms (Constitutional AI, RLAIF)
- `infra/` - Infrastructure components (LLM gateway, MoE router)
- `mcp/` - Model Context Protocol implementation

### `/docs` - Documentation
All project documentation, organized by type.

**Subdirectories**:
- `guides/` - Step-by-step user guides
- `reports/` - Implementation and progress reports
- `architecture/` - System architecture documentation
- `api/` - API documentation

### `/scripts` - Utility Scripts
Operational and maintenance scripts.

**Subdirectories**:
- `ops/` - Operations scripts (setup, reorganization)
- `ingestion/` - Data ingestion scripts
- `maintenance/` - Active maintenance scripts
- `archive/` - Historical/deprecated scripts

### `/tests` - Test Suite
Comprehensive test coverage.

**Subdirectories**:
- `unit/` - Unit tests (organized by module)
- `integration/` - Integration tests
- `e2e/` - End-to-end tests

### `/examples` - Example Code
Demonstrations and tutorials.

**Subdirectories**:
- `demos/` - Runnable demo scripts
- `notebooks/` - Jupyter notebooks

---

## 🚀 2026 Frontier Algorithms

### New Components Added

#### 1. Constitutional AI 2.0
**Location**: `app/ai_core/constitutional/`
**Purpose**: Value alignment and ethical AI
**Files**:
- `constitutional_ai.py` - Main implementation
- `__init__.py` - Package initialization

#### 2. Mixture of Experts (MoE)
**Location**: `app/infra/llm/moe/`
**Purpose**: Dynamic expert routing
**Files**:
- `moe_router.py` - MoE router implementation
- `__init__.py` - Package initialization

#### 3. Agent Memory System
**Location**: `app/agents/memory/`
**Purpose**: Multi-tier agent memory
**Files**:
- `agent_memory.py` - Memory implementation
- `__init__.py` - Package initialization

#### 4. Reinforcement Learning
**Location**: `app/agents/rl/`
**Purpose**: PPO and reward models
**Files**:
- `ppo_policy.py` - PPO implementation
- `reward_model.py` - Reward calculation
- `__init__.py` - Package initialization

#### 5. Emotion Models
**Location**: `app/agents/emotion/`
**Purpose**: PAD emotion model
**Files**:
- `emotion_model.py` - Emotion implementation
- `__init__.py` - Package initialization

---

## 📊 Statistics

### Before Reorganization
- **Root-level docs**: 4 files
- **Docs/ files**: 35+ files (flat structure)
- **Missing __init__.py**: 5 directories
- **Historical scripts**: 37 files in active directories
- **Directory READMEs**: 0

### After Reorganization
- **Root-level docs**: 0 (all moved)
- **Docs/ structure**: Organized into 4 subdirectories
- **Missing __init__.py**: 0 (all added)
- **Historical scripts**: Archived to `scripts/archive/`
- **Directory READMEs**: 6 created

### Total Operations
- **Files moved**: 41
- **Files created**: 11
- **Directories created**: 1
- **Total operations**: 53

---

## 🎓 Best Practices Followed

### ✅ Python Package Structure
- All packages have `__init__.py`
- Clear module hierarchy
- Proper import paths

### ✅ Documentation Organization
- Separate guides, reports, and architecture docs
- README in each major directory
- Clear naming conventions

### ✅ Code Organization
- Separation of concerns
- Logical grouping by functionality
- Clear dependencies

### ✅ Script Management
- Active scripts in main directories
- Historical scripts archived
- Clear naming and purpose

---

## 🔍 Finding Things

### "Where is...?"

**Q: Where are the agent implementations?**
A: `app/agents/` - organized by type (autonomous, practice, simulation)

**Q: Where is the MCP implementation?**
A: `app/mcp/` - all MCP-related code

**Q: Where are the 2026 frontier algorithms?**
A:
- Constitutional AI: `app/ai_core/constitutional/`
- MoE Router: `app/infra/llm/moe/`
- Agent Memory: `app/agents/memory/`
- RL: `app/agents/rl/`
- Emotion: `app/agents/emotion/`

**Q: Where is the documentation?**
A: `docs/` - organized into guides/, reports/, architecture/

**Q: Where are the tests?**
A: `tests/` - organized by type (unit, integration, e2e)

**Q: Where are the examples?**
A: `examples/` - demos and notebooks

---

## 🚀 Next Steps

### Recommended Further Improvements

1. **Add Type Hints**
   - Add comprehensive type hints to all modules
   - Use `mypy` for type checking

2. **Improve Test Coverage**
   - Add tests for new 2026 algorithms
   - Aim for 80%+ coverage

3. **API Documentation**
   - Generate API docs with Sphinx
   - Add docstring examples

4. **CI/CD Pipeline**
   - Add GitHub Actions workflows
   - Automated testing and linting

5. **Docker Optimization**
   - Multi-stage builds
   - Smaller image sizes

---

## 📝 Maintenance

### Keeping Structure Clean

**Do**:
- ✅ Put new features in appropriate directories
- ✅ Add README when creating new directories
- ✅ Archive old scripts instead of deleting
- ✅ Follow naming conventions

**Don't**:
- ❌ Put code in docs/
- ❌ Create flat structures
- ❌ Mix concerns in single files
- ❌ Leave orphaned files

---

## 🎉 Summary

The SalesBoost project now follows world-class open source standards:

- ✅ **Clear structure** - Easy to navigate
- ✅ **Well documented** - README in every major directory
- ✅ **Properly organized** - Logical grouping
- ✅ **Clean codebase** - Historical files archived
- ✅ **Best practices** - Python package standards followed

**This is a production-ready, maintainable codebase!** 🚀
