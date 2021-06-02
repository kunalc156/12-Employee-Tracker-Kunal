# 12-Employee-Tracker-Kunal

# Overview
Build a solution for managing a company's employees using node, inquirer, and MySQL.

# Schema

**department:**

id - INT PRIMARY KEY
name - VARCHAR(30) to hold department name

**role:**

id - INT PRIMARY KEY
title - VARCHAR(30) 
salary - DECIMAL 
department_id - INT 

**employee:**

id - INT PRIMARY KEY
first_name - VARCHAR(30) 
last_name - VARCHAR(30) 
role_id - INT 
manager_id - INT


# Demo Video
https://drive.google.com/file/d/1lDkpFyKPYhm3YPcOX4rwRZZWhuuZjLBf/view
