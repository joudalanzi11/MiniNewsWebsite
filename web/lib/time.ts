// وقت نسبي بالعربي: "قبل ساعتين"، "قبل 5 دقائق"... مع رجوع للتاريخ لو قديم
export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const diffMs = Date.now() - then;
  const sec = Math.round(diffMs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);

  const arabicUnit = (
    n: number,
    one: string,
    two: string,
    few: string,
    many: string,
  ) => {
    if (n === 1) return one;
    if (n === 2) return two;
    if (n >= 3 && n <= 10) return `قبل ${n} ${few}`;
    return `قبل ${n} ${many}`;
  };

  if (sec < 60) return "الآن";
  if (min < 60) return arabicUnit(min, "قبل دقيقة", "قبل دقيقتين", "دقائق", "دقيقة");
  if (hr < 24) return arabicUnit(hr, "قبل ساعة", "قبل ساعتين", "ساعات", "ساعة");
  if (day < 30) return arabicUnit(day, "قبل يوم", "قبل يومين", "أيام", "يوم");

  return new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(then);
}
