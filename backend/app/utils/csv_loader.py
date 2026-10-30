import pandas as pd

def load_csv_to_df(filename):
    """
    فایل CSV را با فرمت مخصوص (بدون هدر و با ستون‌های خاص) می‌خواند و
    دیتافریم مرتب‌شده با ایندکس زمانی برمی‌گرداند.
    """

    # ۱. تعریف اسامی استاندارد ستون‌ها
    column_names = ["Date", "Time", "Open", "High", "Low", "Close", "Volume"]

    # ۲. خواندن فایل CSV بدون هدر
    df = pd.read_csv(filename, header=None, names=column_names)

    # ۳. ادغام تاریخ و زمان و تبدیل به Datetime با مشخص کردن فرمت دقیق
    # فرمت: %Y.%m.%d %H:%M
    df["Datetime"] = pd.to_datetime(
        df["Date"] + " " + df["Time"], format="%Y.%m.%d %H:%M"
    )

    # ۴. حذف ستون‌های تفکیک‌شده و قرار دادن Datetime به عنوان ایندکس
    df.drop(columns=["Date", "Time"], inplace=True)
    df.set_index("Datetime", inplace=True)

    # ۵. مرتب‌سازی زمانی از قدیم به جدید (ضروری برای بک‌تست)
    df.sort_index(inplace=True)

    return df
