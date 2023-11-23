CREATE TABLE USER (
    id varchar(12) NOT NULL,
    pw varchar(255) NOT NULL,
    [name] varchar(4) NOT NULL,
    age int NOT NULL,
    [weight] real NOT NULL,
    height real NOT NULL,
    gender int NOT NULL,
    exercise int NOT NULL,
    created_time date NOT NULL, -->
    goal_weight real NOT NULL,

    CONSTRAINT USER_PK PRIMARY KEY (id)
);

CREATE TABLE LOGIN (
    id varchar(12) NOT NULL,
    pw varchar(255) NULL,

    CONSTRAINT LOGIN_PK PRIMARY KEY (id),
    CONSTRAINT USER_LOGIN_FK FOREIGN KEY (id) 
        REFERENCES USER(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE MYPAGE (
    id varchar(12) NOT NULL,
    basal_meta real NULL, -- 활동량에 따른 것 계산 전
    active_meta real  NULL, -- 활동량에 따른 것 계산 후

    CONSTRAINT MYPAGE_PK PRIMARY KEY (id),
    CONSTRAINT MYPAGE_USER_FK FOREIGN KEY (id) 
        REFERENCES USER(id)
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);


CREATE TRIGGER update_user_meta
BEFORE INSERT OR UPDATE ON MYPAGE
FOR EACH ROW
BEGIN
    DECLARE gender INT;
    DECLARE weight REAL;
    DECLARE height REAL;
    DECLARE age INT;
    DECLARE activity_factor REAL;
    DECLARE user_exercise INT;
    DECLARE user_exists INT;

    SELECT COUNT(*)
    INTO user_exists
    FROM USER
    WHERE USER.id = NEW.id;

    IF user_exists > 0 THEN
        SELECT USER.gender, USER.weight, USER.height, USER.age, USER.exercise 
        INTO gender, weight, height, age, user_exercise
        FROM USER
        WHERE USER.id = NEW.id;

        UPDATE
        IF (gender = 1) THEN  
            SET NEW.basal_meta = 66.5 + (13.75 * weight) + (5.003 * height) - (6.75 * age);
        ELSEIF (gender = 2) THEN  
            SET NEW.basal_meta = 655.1 + (9.56 * weight) + (1.85 * height) - (4.68 * age);
        END IF;

        SET activity_factor = CASE
            WHEN user_exercise = 1 THEN 1.2
            WHEN user_exercise = 2 THEN 1.375
            WHEN user_exercise = 3 THEN 1.55
            WHEN user_exercise = 4 THEN 1.725
            WHEN user_exercise = 5 THEN 1.9
            ELSE 1.55
        END;

        SET NEW.active_meta = NEW.basal_meta * activity_factor;
    END IF;
END;


---


CREATE TABLE PLANNER(
    id varchar(12) NOT NULL,
    [date] date NOT NULL,
    meal_when int NOT NULL, -- 아:1, 점:2, 저:3
    food_name varchar(50) NULL, --> 음식 이름으로,,
    food_carbo real NULL,
    food_protein real NULL,
    food_fat real NULL,
    food_kcal real NULL,

    CONSTRAINT PLANNER_PK PRIMARY KEY (id, [date]),
    CONSTRAINT PLANNER_USER_FK FOREIGN KEY (id) 
        REFERENCES USER(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE REPORT(
    id varchar(12) NOT NULL,
    [date] date NOT NULL,
    [weight] real NULL,

    CONSTRAINT REPORT_PK PRIMARY KEY (id, [date]),
    CONSTRAINT REPORT_USER_FK FOREIGN KEY (id) 
        REFERENCES USER(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
