package com.model.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;

public class DateUtil {


    public static LocalDate localDate;

    static {
        Date myDate = parseDate("2020-10");
        localDate = myDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    public static String nextDate()
            throws Exception {
        localDate = localDate.plus(1, ChronoUnit.MONTHS);
        String s = Date.from(localDate.atStartOfDay()
                .atZone(ZoneId.systemDefault())
                .toInstant()).toString();
        return s;
    }


    public static YearMonth getYearMonth() throws Exception {
        YearMonth yearMonth =
                YearMonth.from(getDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate());
        return yearMonth;
    }

    public static Date parseDate(String date) {
        try {
            return new SimpleDateFormat("yyyy-MM").parse(date);
        } catch (ParseException e) {
            return null;
        }
    }

    public static Date getDate() {
        return Date.from(localDate.atStartOfDay()
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }

    public static Date getYear(String year) throws Exception {
        SimpleDateFormat sd = new SimpleDateFormat("yyyy");
        Date dateyear = sd.parse(year);
        return dateyear;
    }
}
