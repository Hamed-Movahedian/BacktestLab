from datetime import timedelta

from .jalali_str_to_gregorian import (
    gregorian_date_to_jalali_str,
    jalali_str_to_gregorian,
)


def days_between(start_date_str: str, end_date_str: str) -> list[str]:
    start_date = jalali_str_to_gregorian(start_date_str)
    end_date = jalali_str_to_gregorian(end_date_str)
    delta = end_date - start_date
    return [
        gregorian_date_to_jalali_str(start_date + timedelta(days=i))
        for i in range(delta.days + 1)
    ]


# # استفاده:
# start = "2024-06-01"
# end = "2024-06-05"
# days = list(days_between(start, end))
# print("تعداد روزها:", len(days))
# print("روزها:")
# for d in days:
#     print(d)
