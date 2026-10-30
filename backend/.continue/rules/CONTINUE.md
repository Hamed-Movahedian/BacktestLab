# CONTINUE.md

## 1. Project Overview
This project provides a backtesting laboratory for trading strategies, focusing on financial datasets such as gold prices. It exposes API endpoints (using FastAPI) to enable strategy backtesting and result visualization.

**Key Technologies:**
- Python 3
- FastAPI (API server)
- backtesting (Python library)
- pandas, pandas_ta (data handling & indicators)

**High-Level Architecture:**
- API endpoints expose backtest functionality
- Core data loading, strategy logic, and configuration modules
- Modular strategies, data loaders, and utilities
- Data stored in CSV format, ready for backtest

## 2. Getting Started

**Prerequisites:**
- Python 3.8+
- Pip
- (Optional) Virtual environment tool (venv, virtualenv)

**Installation:**
1. Clone the repository
2. (Recommended) Create and activate a virtual environment
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Ensure the necessary CSV data files are placed in `app/data/`

**Basic Usage:**
- Start the API server:
  ```bash
  uvicorn app.main:app --reload
  ```
- Access Health Check: `GET /health`
- Use `/api/backtest/get_back_test` (POST) to run a backtest with default data and strategies

**Running Tests:**
- [Needs verification] No formal test suite detected. Consider adding unit tests under `tests/`.

## 3. Project Structure

- `app/`
  - `main.py`: FastAPI app entry point (router, server config)
  - `api/`
    - `backtestRouter.py`: API route setup for backtesting
  - `backtest/`
    - `backtest.py`: Backtest logic (loads data, executes strategy, formats results)
  - `strategy/`
    - `MacdCrossStrategy.py`: MACD cross trading strategy
    - `sma_cross_strategy.py`: Simple Moving Average cross strategy
  - `utils/`
    - `csv_loader.py`: CSV-to-DataFrame loader
    - `jdate.py, _date_methods/`: Persian calendar & date utilities
  - `core/config.py`: App configuration using environment variables
  - `data/`: Contains time-series CSVs (e.g., `geramTalaHejdah-60minute.csv`)
- `.env`: Environment variables (DO NOT commit sensitive info)
- `requirements.txt`: Python dependencies
- `.continue/rules/`: Continue project configuration

## 4. Development Workflow

**Coding Standards:**
- Follow idiomatic Python (PEP8). Maintain modular design.

**Testing:**
- [Needs verification] Add tests if missing. Use pytest or unittest for new features.

**Build & Deployment:**
- Local run with Uvicorn (see above)
- For production, configure CORS origin and environment variables properly
- [Optional] Use Docker for containerized deployment

**Contribution:**
- Fork, branch, and open PRs for feature/fix
- Document new modules and strategies

## 5. Key Concepts

- **Backtesting:** Simulation of algorithmic trading strategies over historical data
- **Strategy Pattern:** Modular strategy classes for easy extensibility
- **CSV Data Loader:** Central utility for standardized time-series ingestion
- **Indicators:** Use of popular technical indicators (MACD, SMA, etc)
- **API-First Design:** All core features exposed via FastAPI endpoints
- **Persian Calendar Utilities:** Localized handling of time/date (needs review for usage)

## 6. Common Tasks

- **Add new strategy:**
  1. Implement a strategy class in `app/strategy/`
  2. Update import in `backtest.py` if default should change
  3. POST to `/api/backtest/get_back_test` to test

- **Ingest new data:**
  1. Place CSV in `app/data/` (format: Date, Time, Open, High, Low, Close, Volume)
  2. Update path in `backtest.py`

- **Change parameters:**
  1. Edit config/env vars (`app/core/config.py`, `.env`)
  2. Modify strategy parameters directly

## 7. Troubleshooting
- **Server fails to start:**
  - Check Python version & installed dependencies
  - Inspect logs for port conflicts or syntax errors
- **Backtest returns no trades:**
  - Validate data file format and date order
  - Check trading logic thresholds
- **CORS issues:**
  - Adjust `allow_origins` in `main.py` for frontend access

## 8. References
- [FastAPI documentation](https://fastapi.tiangolo.com/)
- [Backtesting.py docs](https://kernc.github.io/backtesting.py/)
- [pandas documentation](https://pandas.pydata.org/)
- [pandas_ta Indicators](https://github.com/twopirllc/pandas-ta)
