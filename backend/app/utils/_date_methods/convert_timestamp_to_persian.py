import datetime

import jdatetime
import pytz


def convert_timestamp_to_persian(timestamp: int) -> str:
    """
    تبدیل تایم‌استمپ به تاریخ شمسی و ساعت تهران
    """
    # ۱. تعیین منطقه زمانی تهران
    tehran_tz = pytz.timezone('Asia/Tehran')
    
    # ۲. تبدیل تایم‌استمپ به شیء datetime با در نظر گرفتن منطقه زمانی تهران
    # استفاده از fromtimestamp با tz باعث می‌شود شیء از نوع Aware باشد
    dt_tehran = datetime.datetime.fromtimestamp(timestamp, tz=tehran_tz)
    
    # ۳. تبدیل datetime میلادی به jdatetime (شمسی)
    # متد .replace(tzinfo=None) برای سازگاری بهتر با jdatetime استفاده می‌شود
    j_dt = jdatetime.datetime.fromgregorian(datetime=dt_tehran)
    
    # ۴. فرمت‌بندی خروجی (تاریخ و ساعت)
    # می‌توانید فرمت را مطابق نیاز پروژه MarketMonitor تغییر دهید
    return j_dt.strftime('%Y/%m/%d %H:%M:%S')

# --- تست کد ---
# یک تایم‌استمپ نمونه (میلی‌ثانیه یا ثانیه)
example_timestamp = 1725771600  # نمونه‌ای از تایم‌استمپ

# اگر تایم‌استمپ شما میلی‌ثانیه است، آن را به ثانیه تبدیل کنید:
# example_timestamp = example_timestamp / 1000

result = convert_timestamp_to_persian(example_timestamp)
print(f"Timestamp: {example_timestamp}")
print(f"Persian Date & Tehran Time: {result}")
