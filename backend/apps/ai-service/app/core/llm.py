import os

from openai import OpenAI

_client = None

def get_openai_client():
    global _client
    if _client is None:
        key = os.getenv("OPENAI_API_KEY")
        if key:
            _client = OpenAI(api_key=key)
    return _client

def get_zen_client():
    api_key = os.getenv("ZEN_API_KEY")
    if not api_key:
        return None
    return OpenAI(
        api_key=api_key,
        base_url="https://opencode.ai/zen/v1",
    )
