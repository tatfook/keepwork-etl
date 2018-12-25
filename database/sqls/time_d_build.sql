delimiter //

DROP PROCEDURE IF EXISTS timedimbuild;
CREATE PROCEDURE timedimbuild ()
BEGIN
    DECLARE v_date DATE;

    DELETE FROM times;
    INSERT INTO times (id) VALUES (1);

    SET v_date = "2010-01-01";
    WHILE v_date < "2028-12-31" DO

        INSERT INTO times (
            id,
            date,
            year,
            month,
            day,
            week,
            quarter,
            dayOfWeek,
            dayOfYear,
            monthName,
            dayName,
            previousDay,
            nextDay
        ) VALUES (
            DATE_FORMAT(v_date, "%Y%m%d"),
            v_date,
            YEAR(v_date),
            MONTH(v_date),
            DAY(v_date),
            WEEK(v_date, 3),
            QUARTER(v_date),
            DAYOFWEEK(v_date),
            DATE_FORMAT(v_date, "%j"),
            MONTHNAME(v_date),
            DAYNAME(v_date),
            DATE_ADD(v_date, INTERVAL -1 DAY),
            DATE_ADD(v_date, INTERVAL 1 DAY)
        );

        SET v_date = DATE_ADD(v_date, INTERVAL 1 DAY);
    END WHILE;

END;


//
delimiter ;
call timedimbuild();