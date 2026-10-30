from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # brsapi_base_url: str = "https://api.brsapi.ir/Tsetmc/Transaction.php"
    # brsapi_key: str

    # sqlite_database_url: str = "data/bourse.db"

    model_config = SettingsConfigDict(  # pyright: ignore[reportUnannotatedClassAttribute]
        env_file=".env",
        extra="ignore",
    )


settings = Settings()  # pyright: ignore[reportCallIssue]
