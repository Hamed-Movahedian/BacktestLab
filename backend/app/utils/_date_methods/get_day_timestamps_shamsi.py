from datetime import datetime, time

import jdatetime


def get_day_timestamps(jalali_date_str):
    """
    دریافت تاریخ شمسی به صورت "yyyy-mm-dd" و بازگرداندن تایم‌استمپ ابتدای و انتهای آن روز
    """
    # تبدیل رشته به تاریخ شمسی
    year, month, day = map(int, jalali_date_str.split("-"))
    # تبدیل به تاریخ میلادی
    gregorian_date = jdatetime.date(year, month, day).togregorian()
    # ابتدای روز
    start_dt = datetime.combine(gregorian_date, time.min)
    # انتهای روز
    end_dt = datetime.combine(gregorian_date, time.max)
    # تبدیل به timestamp
    start_ts = int(start_dt.timestamp())
    end_ts = int(end_dt.timestamp())
    return start_ts, end_ts


# مثال:
# print(get_day_timestamps_shamsi("1405-06-18"))
