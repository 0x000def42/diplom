import base64
import time
import requests
import zipfile
import io

FR_CLOUD_API_KEY = "sia6hnbme7u56xr1udp3i5pp5cs1qd6xwgdgon1aaefwsdbd8pco"
FR_CLOUD_BASE_URL = "https://fastreport.cloud"
FR_CLOUD_FOLDER_ID = "613e0fe3da2af446c694465b"
FR_CLOUD_UPLOAD_URL = f"{FR_CLOUD_BASE_URL}/api/rp/v1/Templates/Folder/{FR_CLOUD_FOLDER_ID}/File"


def fr_cloud_request(method, url, headers=None, json=None, retries=5, delay=1):
    """
    Единая точка для запросов к FastReport Cloud с повторными попытками.
    """
    headers = headers or {}
    headers["Authorization"] = "Basic " + base64.b64encode(
        f"apikey:{FR_CLOUD_API_KEY}".encode("utf-8")
    ).decode("utf-8")

    for attempt in range(1, retries + 1):
        response = requests.request(method, url, headers=headers, json=json)
        if response.status_code == 200:
            return response.json()

        time.sleep(delay)

    response.raise_for_status()


def upload_to_fr_cloud(file_obj, name):
    """
    Загружает файл в FastReport Cloud и возвращает полученный remote_id.
    """
    file_content = file_obj.read()
    data = {
        "name": name,
        "content": base64.b64encode(file_content).decode()
    }
    response = fr_cloud_request("POST", FR_CLOUD_UPLOAD_URL, json=data)
    remote_id = response.get("id")
    if not remote_id:
        raise Exception("Не удалось получить идентификатор (id) из ответа FastReport Cloud")
    return remote_id


def export_to_image(remote_id):
    """
    Отправляет задачу экспорта в изображение и возвращает export_id.
    """
    url = f"{FR_CLOUD_BASE_URL}/api/rp/v1/Templates/File/{remote_id}/Export"
    data = {
        "format": "Image",
        "exportParameters": {"PageRange": "All"}
    }
    response = fr_cloud_request("POST", url, json=data)
    export_id = response.get("id")
    if not export_id:
        raise Exception("Не удалось получить export_id при экспорте в изображение")
    return export_id


def wait_for_export(export_id, max_attempts=10, delay=1):
    """
    Ожидает завершения экспорта по export_id. Возвращает export_id при успехе.
    """
    url = f"{FR_CLOUD_BASE_URL}/api/rp/v1/Exports/File/{export_id}"
    for _ in range(max_attempts):
        response = fr_cloud_request("GET", url)
        status_ = response.get("status")
        if status_ == "Success":
            return export_id
        time.sleep(delay)

    raise Exception("Экспорт не был завершён вовремя (статус не Success)")


def download_export(export_id):
    """
    Скачивает готовый ZIP-архив с изображениями из FastReport Cloud
    и возвращает бинарные данные первого найденного изображения.
    """
    url = f"{FR_CLOUD_BASE_URL}/download/e/{export_id}"
    headers = {
        "Authorization": "Basic " + base64.b64encode(
            f"apikey:{FR_CLOUD_API_KEY}".encode("utf-8")
        ).decode("utf-8")
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        with zipfile.ZipFile(io.BytesIO(response.content), "r") as zf:
            for name in zf.namelist():
                if name.lower().endswith((".jpg", ".jpeg", ".png")):
                    return zf.read(name)
        raise Exception("В ZIP-архиве не обнаружены файлы изображений")
    else:
        raise Exception("Ошибка при скачивании экспортированного архива")
