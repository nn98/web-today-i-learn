# DDL 실습

## 문제 1: 테이블 생성하기 (CREATE TABLE)

#### 1. 
crew_id, nickname
#### 2.
crew_id, nickname, primary key(crew_id)
#### 3.
```
SELECT DISTINCT crew_id, nickname FROM attendance;
```
#### 4.
```
CREATE TABLE crew (  
     crew_id INT NOT NULL AUTO_INCREMENT,  
     nickname VARCHAR(50) NOT NULL,  
     PRIMARY KEY (crew_id)  
);  
```
#### 5.
```
INSERT INTO crew (crew_id, nickname)
SELECT DISTINCT crew_id, nickname FROM attendance;
```

## 문제 2: 테이블 컬럼 삭제하기 (ALTER TABLE)

#### 1.
nickname
#### 2.
```
ALTER TABLE attendance DROP COLUMN nickname;
```

## 문제 3: 외래키 설정하기

#### 1.
```
ALTER TABLE attendance 
ADD CONSTRAINT fk_crew_id FOREIGN KEY (crew_id) REFERENCES crew(crew_id);
```

## 문제 4: 유니크 키 설정

#### 1.
```
ALTER TABLE crew 
ADD CONSTRAINT unique_nickname UNIQUE (nickname);
```

# DML(CRUD) 실습

## 문제 5: 크루 닉네임 검색하기 (LIKE)

#### 1.
```
SELECT * FROM crew WHERE nickname LIKE '디%';
```

## 문제 6: 출석 기록 확인하기 (SELECT + WHERE)

#### 1.
```
SELECT * FROM attendance 
WHERE crew_id = 13 AND attendance_date = '2025-03-06';
```

## 문제 7: 누락된 출석 기록 추가 (INSERT)

#### 1.
```
INSERT INTO attendance (crew_id, attendance_date, start_time, end_time) 
VALUES (13, '2025-03-06', '09:31:00', '18:01:00');
```

## 문제 8: 잘못된 출석 기록 수정 (UPDATE)

#### 1.
```
UPDATE attendance 
SET start_time = '10:00:00' 
WHERE crew_id = 14 AND attendance_date = '2025-03-12';
```

## 문제 9: 허위 출석 기록 삭제 (DELETE)

#### 1.
```
DELETE FROM attendance 
WHERE crew_id = 15 AND attendance_date = '2025-03-12';
`````

## 문제 10: 출석 정보 조회하기 (JOIN)

#### 1.
```
SELECT c.nickname, a.attendance_date, a.start_time, a.end_time 
FROM attendance a 
JOIN crew c ON a.crew_id = c.crew_id;
```

## 문제 11: nickname으로 쿼리 처리하기 (서브 쿼리)

#### 1.
```
SELECT * FROM attendance 
WHERE crew_id = (SELECT crew_id FROM crew WHERE nickname = '검프');
```

## 문제 12: 가장 늦게 하교한 크루 찾기

#### 1.
```
SELECT c.nickname, a.end_time 
FROM attendance a 
JOIN crew c ON a.crew_id = c.crew_id 
WHERE a.attendance_date = '2025-03-05' 
ORDER BY a.end_time DESC 
LIMIT 1;
```

## 문제 13: 크루별로 '기록된' 날짜 수 조회

#### 1.
```
SELECT crew_id, COUNT(attendance_date) AS total_days 
FROM attendance 
GROUP BY crew_id;
```

## 문제 14: 크루별로 등교 기록이 있는(start_time IS NOT NULL) 날짜 수 조회

#### 1.
```
SELECT crew_id, COUNT(start_time) AS attended_days 
FROM attendance 
WHERE start_time IS NOT NULL 
GROUP BY crew_id;
```

## 문제 15: 날짜별로 등교한 크루 수 조회

#### 1.
```
SELECT attendance_date, COUNT(DISTINCT crew_id) AS crew_count 
FROM attendance 
WHERE start_time IS NOT NULL 
GROUP BY attendance_date;
```

## 문제 16: 크루별 가장 빠른 등교 시각(MIN)과 가장 늦은 등교 시각(MAX)

#### 1.
```
SELECT crew_id, MIN(start_time) AS earliest_time, MAX(start_time) AS latest_time 
FROM attendance 
GROUP BY crew_id;
```

---

# **🤔 생각해 보기**

1. **기본키(Primary Key)의 필요성**  
  기본키가 없으면 데이터의 중복 제거가 불가능하고,  
  데이터 튜플의 특정과 지정이 매우 어려워짐.

2. **AUTO_INCREMENT의 필요성**  
  고유값인 ID 를 직접 특정하게 하면 다양한 충돌 발생  
  데이터베이스가 스스로 판단해서 자동으로 값을 넣어줘야 방지 가능  

3. **NULL 처리 시 주의점**  
  Null 이어선 안 되는 값(출퇴근 테이블에서의 퇴근시간 등)이 Null 이지 않도록  
  not null 제약조건 설정이 필수적  

4. **ER 다이어그램 및 일상 예시**  
  고유한 식별자를 가진 크루 `1` 명 : 특정 크루의 출석 정보들 `N` 개 

5. **동시 접속과 트랜잭션 (ACID)**  
  동시에 출석이 발생할 가능성은 농후.  
  근데뭐 순차적으로 처리되도록 락만 걸어주면 여기선 문제없지않나? 출석인데    
   
6. **데이터베이스 vs 파일 시스템**  
  파일엔 데이터베이스처럼 제약조건 설정 불가, 중복 가능,  
  데이터가 일관적이지 않은 상태로 저장 가능, 동시에 접근 가능, 보안 취약  
   
7. **NoSQL 도입 시 구조와 장단점**  
  장 : JOIN 없이도 한 번에 정보 조회 가능  
  단 : 데이터 집계와 수정이 복잡하고 난해해짐  

---

### **🧐 더 생각해 보기 (심화) 해설**  

1. **대리키(Surrogate Key) vs 자연키(Natural Key)**  
  실제 데이터를 표현한다고 실제의 값을 사용 시 변경과 중복의 가능성 농후.(다른 기수 동일 닉 다수 존재)  
  실제 데이터와는 무관한 대리 키를 사용해야 변경/중복의 위험성 회피 가능

2. **RESTRICT vs CASCADE**  
  `RESTRICT` : 해당 값을 참조해간 튜플이 존재하면 해당 값 삭제 불가. 열받음  
  `CASCADE` : 해당 값을 참조해간 튜플이 존재하면 싸그리 삭제. 편함(다같이 터질 위험성과 함께)

3. **서브쿼리 vs JOIN의 성능적 접근**  
  DB 잘쓴다는 기준이 얼마나 조인을 줄이느냐 라고 얼핏 들었는데  
  마찬가지로 애매하게 알기론 서브쿼리도 만만찮게 성능 저하가 크다 들음  
  결국엔 둘 중 어떤게 데이터 양이나 성능에 효과적인지 케바케라 잘 판단하는게?  

--- 도와줘요 제미나이! ---

4. **정규화 vs 비정규화의 트레이드오프**  
    * **정규화 장점:** 데이터 중복을 제거하여 갱신 이상(Update Anomaly)을 방지하고 완벽한 데이터 무결성을 보장합니다. 디스크 스토리지 효율이 증가합니다.
    * **비정규화 이점:** 데이터 정합성이 다소 깨질 위험을 감수하더라도, 조인(JOIN) 연산을 제거하여 CPU 및 메모리 연산 비용을 아끼고 읽기(Select) 속도를 극한으로 끌어올릴 수 있습니다.

5. **커넥션 풀링(Connection Pooling)의 필수성**  
   수백 명의 사용자가 발생시킬 때마다 DB와 TCP/IP 통신 핸드셰이크(Handshake)를 맺고 인증하는 과정은 전체 시스템 응답 시간의 막대한 비중을 차지합니다. 애플리케이션 기동 시점에 일정 수의 커넥션을 미리 맺어 수영장(Pool)에 보관하고 이를 재사용함으로써 통신 오버헤드를 제로(0)에 가깝게 최적화하는 핵심 인프라 기술입니다.

6. **트랜잭션(Transaction) 처리의 원리**  
   `BEGIN; INSERT ...; UPDATE ...; DELETE ...; COMMIT;` 의 형태로 묶여야 합니다. 중간인 DELETE 작업 중 예외가 발생하면 즉각 `ROLLBACK;` 명령이 실행되어 앞선 INSERT와 UPDATE의 반영 사항이 모두 디스크에서 철회(Undo)됩니다. 이는 트랜잭션의 **원자성(Atomicity)** 원칙에 따라 "모두 성공하거나 아무것도 실행되지 않은 상태(All or Nothing)"를 데이터베이스 엔진이 완벽하게 보장하기 때문입니다.
