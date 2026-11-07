create database project;
use project; 

create user Project;

-- 1. 알바생 테이블 생성
create table 알바생 (
	알바생ID int not null primary key,
    이름 char(5) not null,
    전화번호 int not null,
    근무가능시간 char(20),
    주소 char(30)
);
    
-- 2. 물류센터 테이블 생성
create table 물류센터 (
	센터ID char(30) not null primary key,
    센터명 char(10),
    위치 char(30)
);
    
-- 3. 업무 테이블 생성
create table 업무 (
	업무ID char(20) not null primary key,
    업무명 char(10),
    업무종류 char(10),
    시급 int 
);
    
-- 4. 근무 테이블 생성 (외래키 설정 포함)
create table 근무 (
    근무ID char(20) not null primary key,
    근무날짜 char(30),
    근무시간 char(20),
    급여 int,
    알바생ID int not null,
    센터ID char(30) not null,
    업무ID char(20) not null,
    foreign key (알바생ID) references 알바생(알바생ID),
    foreign key (센터ID) references 물류센터(센터ID),
    foreign key (업무ID) references 업무(업무ID)
);

-- 알바생 데이터 삽입
insert into 알바생 values (20232656, "이은아", 01011111547, "18:00~21:00", "천안 서북구");
insert into 알바생 values (20232657, "이응아", 01012341058, "19:00~23:00", "천안 동남구");
insert into 알바생 values (20232658, "이은이", 01000011259, "00:00~07:00", "대전 뭐있냐");

-- 물류센터 데이터 삽입
insert into 물류센터 values ("CK1001", "천안 쿠팡 센터", "천안시");
insert into 물류센터 values ("CK1005", "대전 쿠팡 센터", "대전");
insert into 물류센터 values ("CK1006", "수원 쿠팡 센터", "수원");
insert into 물류센터 values ("CK1007", "인천 쿠팡 센터", "인천");
insert into 물류센터 values ("CK1008", "울산 쿠팡 센터", "울산");

-- 업무 데이터 삽입
insert into 업무 values ("ABG2084", "알바생", "물류", "100000");
insert into 업무 values ("ABG2085", "알바생", "박스", "100000");
insert into 업무 values ("ABG2086", "알바생", "운전", "100000");
insert into 업무 values ("ABG2087", "알바생", "테이핑", "100000");

-- 근무 데이터 삽입 (기존 데이터와 추가 데이터를 골고루 섞어 배치)
-- 컬럼 순서: 근무ID, 근무날짜, 근무시간, 급여, 알바생ID, 센터ID, 업무ID
insert into 근무 values ("G1001", "2026.06.10", "18:00~21:00", 300000, 20232656, "CK1001", "ABG2084");
insert into 근무 values ("G1002", "2026.06.11", "19:00~23:00", 400000, 20232657, "CK1005", "ABG2085");
insert into 근무 values ("G1003", "2026.06.12", "00:00~07:00", 700000, 20232658, "CK1006", "ABG2086");
insert into 근무 values ("G1004", "2026.06.13", "18:00~21:00", 300000, 20232656, "CK1001", "ABG2087");
insert into 근무 values ("G1005", "2026.06.14", "19:00~23:00", 400000, 20232657, "CK1007", "ABG2084");
insert into 근무 values ("G1006", "2026.06.15", "00:00~07:00", 700000, 20232658, "CK1008", "ABG2085");


-- 문제 

-- 1. 알바생 테이블의 모든 행과 열을 조회하시오.
SELECT * FROM 알바생;

-- 2. 업무 테이블에 등록된 모든 업무의 이름과 시급을 조회하시오.
SELECT 업무명, 시급 FROM 업무;

-- 3. 물류센터 테이블에서 위치가 '천안시'인 센터의 센터명을 조회하시오.
SELECT 센터명 FROM 물류센터 WHERE 위치 = '천안시';

-- 4. 알바생 테이블에서 알바생ID가 20232657인 사원의 이름과 전화번호를 조회하시오.
SELECT 이름, 전화번호 FROM 알바생 WHERE 알바생ID = 20232657;

-- 5. 근무 테이블에서 급여가 400000원인 근무 기록의 모든 정보를 조회하시오.
SELECT * FROM 근무 WHERE 급여 = 400000;

-- 6. 업무 테이블에서 시급이 높은 업무부터 순서대로(내림차순) 정렬하여 조회하시오.
SELECT * FROM 업무 ORDER BY 시급 DESC;

-- 7. 알바생 테이블에서 주소에 '천안'이라는 단어가 포함된 알바생의 정보를 조회하시오.
SELECT * FROM 알바생 WHERE 주소 LIKE '%천안%';


-- 8. 근무 테이블에 등록된 전체 근무 기록의 총 개수(근무 건수)를 구하시오.
SELECT COUNT(*) FROM 근무;

-- 9. 근무 테이블에서 지금까지 지급된 알바생 급여의 전체 합계를 구하시오.
SELECT SUM(급여) FROM 근무;

-- 10. 알바생 테이블에서 중복을 제외한 순수 '근무가능시간'의 종류가 몇 개인지 조회하시오.
SELECT COUNT(DISTINCT 근무가능시간) FROM 알바생;

-- 11. 근무 테이블에서 각 알바생ID별로 실행한 총 근무 횟수를 조회하시오.
SELECT 알바생ID, COUNT(*) FROM 근무 GROUP BY 알바생ID;

-- 12. 근무 테이블에서 각 물류센터ID별로 지급된 총 급여액을 구하시오.
SELECT 센터ID, SUM(급여) FROM 근무 GROUP BY 센터ID;

-- 13. 근무 테이블에서 근무 기록을 날짜순으로 정렬하되, 날짜가 같다면 급여가 높은 순으로 정렬하시오.
SELECT * FROM 근무 ORDER BY 근무날짜 ASC, 급여 DESC;

-- 14. 근무 테이블에서 각 업무ID별로 지급된 평균 급여를 구하시오.
SELECT 업무ID, AVG(급여) FROM 근무 GROUP BY 업무ID;


-- 15. 근무 테이블과 알바생 테이블을 조인하여 근무ID, 근무날짜, 그리고 알바생의 이름을 조회하시오.
SELECT g.근무ID, g.근무날짜, a.이름 FROM 근무 g JOIN 알바생 a ON g.알바생ID = a.알바생ID;

-- 16. 근무 테이블과 물류센터 테이블을 조인하여 '천안 쿠팡 센터'에서 근무한 기록의 근무날짜와 급여를 조회하시오.
SELECT g.근무날짜, g.급여 FROM 근무 g JOIN 물류센터 c ON g.센터ID = c.센터ID WHERE c.센터명 = '천안 쿠팡 센터';

-- 17. '이은아' 알바생이 근무한 날짜와 배정받았던 근무시간을 조회하시오.
SELECT g.근무날짜, g.근무시간 FROM 근무 g JOIN 알바생 a ON g.알바생ID = a.알바생ID WHERE a.이름 = '이은아';

-- 18. '박스' 종류의 업무를 수행한 근무 기록의 근무ID, 급여, 업무종류를 조회하시오.
SELECT g.근무ID, g.급여, j.업무종류 FROM 근무 g JOIN 업무 j ON g.업무ID = j.업무ID WHERE j.업무종류 = '박스';

-- 19. 각 알바생의 이름과 해당 알바생이 지금까지 근무하여 받은 총 누적 급여를 조회하시오.
SELECT a.이름, SUM(g.급여) FROM 근무 g JOIN 알바생 a ON g.알바생ID = a.알바생ID GROUP BY a.이름;

-- 20. 각 물류센터의 센터명과 해당 센터에서 진행된 총 근무 건수를 조회하시오.
SELECT c.센터명, COUNT(g.근무ID) FROM 근무 g JOIN 물류센터 c ON g.센터ID = c.센터ID GROUP BY c.센터명;


-- 21. 알바생 이름, 근무한 물류센터의 센터명, 수행한 업무명을 한 번에 묶어서 조회하시오.
SELECT a.이름, c.센터명, j.업무명 FROM 근무 g JOIN 알바생 a ON g.알바생ID = a.알바생ID JOIN 물류센터 c ON g.센터ID = c.센터ID JOIN 업무 j ON g.업무ID = j.업무ID;

-- 22. '이응아' 알바생이 근무한 물류센터의 센터명과 해당 센터의 실제 위치를 조회하시오.
SELECT c.센터명, c.위치 FROM 근무 g JOIN 알바생 a ON g.알바생ID = a.알바생ID JOIN 물류센터 c ON g.센터ID = c.센터ID WHERE a.이름 = '이응아';

-- 23. 근무 테이블에서 총 누적 급여 합계가 700,000원 이상인 알바생의 ID와 총 급여를 조회하시오.
SELECT 알바생ID, SUM(급여) FROM 근무 GROUP BY 알바생ID HAVING SUM(급여) >= 700000;

-- 24. 업무 테이블에서 가장 시급이 높은 업무를 수행한 근무 기록의 근무ID와 급여를 서브쿼리를 사용하여 조회하시오.
SELECT 근무ID, 급여 FROM 근무 WHERE 업무ID = (SELECT 업무ID FROM 업무 ORDER BY 시급 DESC LIMIT 1);

-- 25. '운전' 업무를 수행한 알바생들의 이름과 전화번호를 중복 없이 조회하시오.
SELECT DISTINCT a.이름, a.전화번호 FROM 근무 g JOIN 알바생 a ON g.알바생ID = a.알바생ID JOIN 업무 j ON g.업무ID = j.업무ID WHERE j.업무종류 = '운전';


commit;