import os


def get_zen_api_key():
    return os.getenv("ZEN_API_KEY")


def get_zen_model():
    return os.getenv("ZEN_MODEL", "deepseek-v4-flash-free")
