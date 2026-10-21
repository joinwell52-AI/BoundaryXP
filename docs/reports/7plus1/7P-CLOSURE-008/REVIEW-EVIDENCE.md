# Frozen candidate item review

## SWAI-001

I p1:6a3f019d9ba2d45cd27ca9c4 RESOLVED `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法

Previous: MATCH; exact fact unchanged: false

[1911,1998) 2. `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")`。 
[1998,2091) 3. `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir, self.log_dir / "reports")`。 
[2091,2181) 4. `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir, self.log_dir / "issues")`。 
[325,401) 修 `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法
[1886,1902) yield entry.name
[325,326) 修
[327,401) `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

I p1:0565fbc2225e98bdf40515de RESOLVED active

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[402,440) 使 next_seq 计算同时看 active 与 archived 两路径
[417,418) 看
[419,425) active

I p1:28f650e1b6ddbe5ec9cf6d93 RESOLVED archived

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[402,440) 使 next_seq 计算同时看 active 与 archived 两路径
[417,418) 看
[428,436) archived

I p1:0cd906c1678fae839d8fa672 RESOLVED tests/test_fcop/test_project_tasks.py

Previous: NEW; exact fact unchanged: false

[2240,2342) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点：
[2243,2280) tests/test_fcop/test_project_tasks.py

I p1:308504fdde38bd127ab85f73 RESOLVED test_project_reports.py

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[2240,2342) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点：
[2283,2306) test_project_reports.py

I p1:b2e9d614ad8efb86956f905d RESOLVED test_project_issues.py

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[2240,2342) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点：
[2309,2331) test_project_issues.py

I p1:df1491d16679f0048ef16465 RESOLVED entry

Previous: NEW; exact fact unchanged: false

[1911,1998) 2. `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")`。 
[1886,1902) yield entry.name
[1914,1970) `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()
[1810,1815) entry

I p1:bd2e8791fe4dfdad5659ff5f RESOLVED entry

Previous: NEW; exact fact unchanged: false

[1911,1998) 2. `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")`。 
[1886,1902) yield entry.name
[1914,1970) `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()
[1810,1815) entry

I p1:32bff907c67a4219c16cc7fe RESOLVED entry

Previous: NEW; exact fact unchanged: false

[1998,2091) 3. `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir, self.log_dir / "reports")`。 
[1886,1902) yield entry.name
[2001,2061) `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()
[1810,1815) entry

I p1:c54ed720fcf9d07ceae7e3ba RESOLVED entry

Previous: NEW; exact fact unchanged: false

[1998,2091) 3. `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir, self.log_dir / "reports")`。 
[1886,1902) yield entry.name
[2001,2061) `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()
[1810,1815) entry

I p1:14b8286c6bbcdc0655e88fe6 RESOLVED entry

Previous: NEW; exact fact unchanged: false

[2091,2181) 4. `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir, self.log_dir / "issues")`。 
[1886,1902) yield entry.name
[2094,2152) `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()
[1810,1815) entry

I p1:efdc798d987312d379fe22f4 RESOLVED entry

Previous: NEW; exact fact unchanged: false

[2091,2181) 4. `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir, self.log_dir / "issues")`。 
[1886,1902) yield entry.name
[2094,2152) `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()
[1810,1815) entry

O p1:52632fa9dffa8346cae86238 RESOLVED `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法

Previous: PARTIAL_SUPPORT; exact fact unchanged: false

[1911,1998) 2. `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")`。 
[1998,2091) 3. `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir, self.log_dir / "reports")`。 
[2091,2181) 4. `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir, self.log_dir / "issues")`。 
[325,401) 修 `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法
[352,362) write_task
[367,379) write_report
[384,395) write_issue
[402,440) 使 next_seq 计算同时看 active 与 archived 两路径
[1886,1902) yield entry.name
[325,326) 修
[327,401) `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法
[413,415) 计算
[417,418) 看
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

O p1:8280f13f7bc9cdecc1055db0 RESOLVED _existing_filenames_for_seq

Previous: NEW; exact fact unchanged: false

[1262,1296) 在 `src/fcop/project.py` 加一个私有辅助函数：
[1265,1284) src/fcop/project.py
[1286,1287) 加
[1318,1345) _existing_filenames_for_seq

O p1:3b1fff876ce8c53b5bbe8d39 RESOLVED write_task

Previous: PARTIAL_SUPPORT; exact fact unchanged: false

[1911,1998) 2. `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")`。 
[1886,1902) yield entry.name
[1914,1970) `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir
[1915,1925) write_task
[1928,1930) 调用
[1933,1995) _existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

O p1:ae8095a87679f2cb9694f3a9 RESOLVED write_report

Previous: PARTIAL_SUPPORT; exact fact unchanged: false

[1998,2091) 3. `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir, self.log_dir / "reports")`。 
[1886,1902) yield entry.name
[2001,2061) `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir
[2002,2014) write_report
[2017,2019) 调用
[2022,2088) _existing_filenames_for_seq(reports_dir, self.log_dir / "reports")
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

O p1:15a8efcd26787a209f033842 RESOLVED write_issue

Previous: PARTIAL_SUPPORT; exact fact unchanged: false

[2091,2181) 4. `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir, self.log_dir / "issues")`。 
[1886,1902) yield entry.name
[2094,2152) `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir
[2095,2106) write_issue
[2109,2111) 调用
[2114,2178) _existing_filenames_for_seq(issues_dir, self.log_dir / "issues")
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

O p1:273cdbe9d8183d566e984fa0 RESOLVED tests/test_fcop/test_project_tasks.py

Previous: NEW; exact fact unchanged: false

[2240,2343) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点： 
[2505,2563) 测试名字要明确包含 `seq_skips_archived` 这样语义，方便后人达到同样问题时 grep 能找到。 
[2240,2342) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点：
[2243,2280) tests/test_fcop/test_project_tasks.py
[2283,2306) test_project_reports.py
[2309,2331) test_project_issues.py
[2417,2462) # 预存入 log/tasks/TASK-{date}-001-... （手工造一个文件）
[2516,2534) seq_skips_archived
[2335,2336) 加
[2354,2500) def test_write_task_seq_skips_archived_basename(tmp_path):     # 预存入 log/tasks/TASK-{date}-001-... （手工造一个文件）     # 调用 write_task，应该拿到 002 而不是 001 
[2467,2499) # 调用 write_task，应该拿到 002 而不是 001

O p1:7a6dd4581a74649cfdf394de RESOLVED test_project_reports.py

Previous: NEW; exact fact unchanged: false

[2240,2343) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点： 
[2505,2563) 测试名字要明确包含 `seq_skips_archived` 这样语义，方便后人达到同样问题时 grep 能找到。 
[2240,2342) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点：
[2243,2280) tests/test_fcop/test_project_tasks.py
[2283,2306) test_project_reports.py
[2309,2331) test_project_issues.py
[2417,2462) # 预存入 log/tasks/TASK-{date}-001-... （手工造一个文件）
[2516,2534) seq_skips_archived
[2335,2336) 加
[2354,2500) def test_write_task_seq_skips_archived_basename(tmp_path):     # 预存入 log/tasks/TASK-{date}-001-... （手工造一个文件）     # 调用 write_task，应该拿到 002 而不是 001 
[2467,2499) # 调用 write_task，应该拿到 002 而不是 001

O p1:12c6621779ede0a551840901 RESOLVED test_project_issues.py

Previous: NEW; exact fact unchanged: false

[2240,2343) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点： 
[2505,2563) 测试名字要明确包含 `seq_skips_archived` 这样语义，方便后人达到同样问题时 grep 能找到。 
[2240,2342) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点：
[2243,2280) tests/test_fcop/test_project_tasks.py
[2283,2306) test_project_reports.py
[2309,2331) test_project_issues.py
[2417,2462) # 预存入 log/tasks/TASK-{date}-001-... （手工造一个文件）
[2516,2534) seq_skips_archived
[2335,2336) 加
[2354,2500) def test_write_task_seq_skips_archived_basename(tmp_path):     # 预存入 log/tasks/TASK-{date}-001-... （手工造一个文件）     # 调用 write_task，应该拿到 002 而不是 001 
[2467,2499) # 调用 write_task，应该拿到 002 而不是 001

A p1:0d25b95a38e20f1e3fc501d4 RESOLVED REQUIRED 修 `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法、write_task、write_report、write_issue

Previous: PARTIAL_SUPPORT; exact fact unchanged: false

[1911,1998) 2. `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")`。 
[1998,2091) 3. `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir, self.log_dir / "reports")`。 
[2091,2181) 4. `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir, self.log_dir / "issues")`。 
[325,401) 修 `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法
[352,362) write_task
[367,379) write_report
[384,395) write_issue
[402,440) 使 next_seq 计算同时看 active 与 archived 两路径
[1886,1902) yield entry.name
[325,326) 修
[327,401) `src/fcop/project.py` 中 `write_task` / `write_report` / `write_issue` 三个方法
[413,415) 计算
[417,418) 看
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

A p1:ff254ac916ed1ed918dedb92 RESOLVED REQUIRED 加 src/fcop/project.py、_existing_filenames_for_seq

Previous: NEW; exact fact unchanged: false

[1262,1296) 在 `src/fcop/project.py` 加一个私有辅助函数：
[1265,1284) src/fcop/project.py
[1286,1287) 加
[1318,1345) _existing_filenames_for_seq

A p1:400883bc24fa4c2bde639140 RESOLVED REQUIRED 调用 write_task

Previous: PARTIAL_SUPPORT; exact fact unchanged: false

[1911,1998) 2. `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")`。 
[1886,1902) yield entry.name
[1914,1970) `write_task` 里调用为 `_existing_filenames_for_seq(tasks_dir
[1915,1925) write_task
[1928,1930) 调用
[1933,1995) _existing_filenames_for_seq(tasks_dir, self.log_dir / "tasks")
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

A p1:d4cf3ae41a96b0d5efcb2388 RESOLVED REQUIRED 调用 write_report

Previous: PARTIAL_SUPPORT; exact fact unchanged: false

[1998,2091) 3. `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir, self.log_dir / "reports")`。 
[1886,1902) yield entry.name
[2001,2061) `write_report` 里调用为 `_existing_filenames_for_seq(reports_dir
[2002,2014) write_report
[2017,2019) 调用
[2022,2088) _existing_filenames_for_seq(reports_dir, self.log_dir / "reports")
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

A p1:ff0912e162bfdab8b5f61cab RESOLVED REQUIRED 调用 write_issue

Previous: PARTIAL_SUPPORT; exact fact unchanged: false

[2091,2181) 4. `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir, self.log_dir / "issues")`。 
[1886,1902) yield entry.name
[2094,2152) `write_issue` 里调用为 `_existing_filenames_for_seq(issues_dir
[2095,2106) write_issue
[2109,2111) 调用
[2114,2178) _existing_filenames_for_seq(issues_dir, self.log_dir / "issues")
[1355,1359) dirs
[1405,1718) """Yield basenames of files under *all* given directories.         Used to compute the next sequence for task/report/issue        writes so that archived files in ``log/<type>/`` are taken        into account and we never reuse a basename that is already        on disk somewhere in the project ledger.        """
[1726,1902) for d in dirs:            if not d.is_dir():                continue            for entry in d.iterdir():                if entry.is_file():                    yield entry.name
[1850,1865) entry.is_file()

A p1:e609f74c54ee0c97982b85bf RESOLVED REQUIRED 加 tests/test_fcop/test_project_tasks.py、test_project_reports.py、test_project_issues.py

Previous: NEW; exact fact unchanged: false

[2240,2343) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点： 
[2505,2563) 测试名字要明确包含 `seq_skips_archived` 这样语义，方便后人达到同样问题时 grep 能找到。 
[2240,2342) 在 `tests/test_fcop/test_project_tasks.py`、`test_project_reports.py`、`test_project_issues.py` 中各加一个测试点：
[2243,2280) tests/test_fcop/test_project_tasks.py
[2283,2306) test_project_reports.py
[2309,2331) test_project_issues.py
[2417,2462) # 预存入 log/tasks/TASK-{date}-001-... （手工造一个文件）
[2516,2534) seq_skips_archived
[2335,2336) 加
[2354,2500) def test_write_task_seq_skips_archived_basename(tmp_path):     # 预存入 log/tasks/TASK-{date}-001-... （手工造一个文件）     # 调用 write_task，应该拿到 002 而不是 001 
[2467,2499) # 调用 write_task，应该拿到 002 而不是 001

P p1:7bf22b95998e5d84eb3c7649 RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[44,57) recipient: ME
[55,57) ME

V p1:a5ec9f5ae314895324a2f0b5 RESOLVED ISSUE-20260427-003-ME.md

Previous: MATCH; exact fact unchanged: true

[178,204) - ISSUE-20260427-003-ME.md
[180,204) ISSUE-20260427-003-ME.md

V p1:9cf7809df00a855de76a02aa RESOLVED TASK-20260427-002-ADMIN-to-ME.md

Previous: MATCH; exact fact unchanged: true

[178,204) - ISSUE-20260427-003-ME.md
[206,238) TASK-20260427-002-ADMIN-to-ME.md

V p1:b2ace6ac4b8f260cc76161bd RESOLVED src/fcop/project.py:1024

Previous: NEW; exact fact unchanged: false

[178,204) - ISSUE-20260427-003-ME.md
[240,264) src/fcop/project.py:1024

V p1:d609fb58dc716e8c0530cdce RESOLVED ISSUE-20260427-003-ME.md

Previous: NEW; exact fact unchanged: false

[295,324) 针对 `ISSUE-20260427-003-ME.md`
[299,323) ISSUE-20260427-003-ME.md

C p1:52ec0db640bad4eaca7c3dde RESOLVED ## 验收标准 

Previous: NEW; exact fact unchanged: false

[2564,2572) ## 验收标准 
[2564,2571) ## 验收标准
[2573,2581) - 三份新测试绿
[2582,2600) - 现有 587 passed 不退
[2601,2613) - ruff clean
[2614,2706) - D:\FCoP 本仓被抢救过的两件手工 rename 文件在运行中不被误伤（他们在 `tasks/` 与 `reports/`、本身序号 002、与 log/ 中的 001 不冲）

B p1:ef11083ad1b2baf0c21ff0f3 RESOLVED FORBIDDEN O_EXCL 原子预占逻辑不变 O_EXCL 原子预占逻辑

Previous: MATCH; exact fact unchanged: true

[2182,2197) O_EXCL 原子预占逻辑不变
[2182,2195) O_EXCL 原子预占逻辑

B p1:70c3754215a35a6bf8712b9c RESOLVED FORBIDDEN retry 限不变 retry 限

Previous: MATCH; exact fact unchanged: true

[2198,2207) retry 限不变
[2198,2205) retry 限

B p1:02ae4f4303b050b24ea04f0e RESOLVED FORBIDDEN `next_sequence()` 本身不变 `next_sequence()` 本身

Previous: MATCH; exact fact unchanged: true

[2208,2230) `next_sequence()` 本身不变
[2208,2228) `next_sequence()` 本身

B p1:cecbc881f1bf009f79341af8 RESOLVED FORBIDDEN 改 next_sequence()` 本身的语义——它是纯函数

Previous: NEW; exact fact unchanged: false

[2777,2812) - 不改 `next_sequence()` 本身的语义——它是纯函数
[2780,2781) 改
[2783,2812) next_sequence()` 本身的语义——它是纯函数

## SWAI-002

I p1:6dd67193dcd1497e6e02f6b4 RESOLVED src/

Previous: NEW; exact fact unchanged: false

[790,823) 涉及 ~1000+ 行 src/ 改动——不是 atomic 任务
[802,806) src/

I p1:265275daafc93a4f2f2e8206 RESOLVED spec/schemas/

Previous: NEW; exact fact unchanged: false

[2282,2307) `spec/schemas/` 是**协议权威**
[2283,2296) spec/schemas/

I p1:d866326ecfc8a3cd5d8b261b RESOLVED core/jsonschema_validator.py

Previous: NEW; exact fact unchanged: false

[2400,2446) ### 决议 2 · `core/jsonschema_validator.py` 是新模块
[2412,2440) core/jsonschema_validator.py

I p1:e59ffbc3e0023ccd4584220e RESOLVED core/schema.py

Previous: NEW; exact fact unchanged: false

[2450,2501) 不要往 `core/schema.py` 上叠——按 ADR-0001 那个模块是**协议常量**模块
[2455,2469) core/schema.py

O p1:40cc6e1145b1e600c8203ec8 RESOLVED tests/test_schemas/test_bundled_schemas_in_sync.py

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[2308,2395) 新增测试 `tests/test_schemas/test_bundled_schemas_in_sync.py` 强制两份相同——任何 commit 让两份漂移都会断 CI
[2314,2364) tests/test_schemas/test_bundled_schemas_in_sync.py
[2308,2310) 新增

O p1:916520c5e5ba7c9eeff59ee3 RESOLVED tests/test_fcop/test_review_no_v12_features.py

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[5334,5403) 新增测试 `tests/test_fcop/test_review_no_v12_features.py` 显式 ASSERT 它们不存在
[5340,5386) tests/test_fcop/test_review_no_v12_features.py
[5334,5336) 新增

A p1:2dfe94461bde96f7724b65c2 UNRESOLVED PERMITTED 审

Previous: UNRESOLVED; exact fact unchanged: true

[1604,1621) 这样每个任务都 atomic 可审
[1620,1621) 审
[1612,1618) atomic

A p1:b75aa89ab776bbc1a4f99757 RESOLVED REQUIRED 考虑 三个方案

Previous: NEW; exact fact unchanged: false

[1984,1992) 考虑过三个方案：
[1984,1986) 考虑
[1987,1991) 三个方案

A p1:45f4f1bbc1892b53356c244b RESOLVED REQUIRED 新增 tests/test_schemas/test_bundled_schemas_in_sync.py

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[2308,2395) 新增测试 `tests/test_schemas/test_bundled_schemas_in_sync.py` 强制两份相同——任何 commit 让两份漂移都会断 CI
[2314,2364) tests/test_schemas/test_bundled_schemas_in_sync.py
[2308,2310) 新增

A p1:27217ecf41bff69bda3e7047 RESOLVED REQUIRED 开 个兄弟模块

Previous: NEW; exact fact unchanged: false

[2509,2515) 开个兄弟模块
[2509,2510) 开
[2510,2515) 个兄弟模块

A p1:089a0c0130d0f0ab23ac5b24 RESOLVED REQUIRED 公开面 delta

Previous: NEW; exact fact unchanged: false

[2516,2526) 公开面 delta：
[2516,2519) 公开面
[2520,2525) delta

A p1:a0229ad8f8f6339e97d1fe65 RESOLVED REQUIRED 外加 两个新枚举、models.py

Previous: NEW; exact fact unchanged: false

[3809,3832) 外加两个新枚举（在 `models.py`）：
[3820,3829) models.py
[3809,3811) 外加
[3811,3816) 两个新枚举

A p1:3b466230c01d8ddc04ff3bd0 RESOLVED REQUIRED 新增 tests/test_fcop/test_review_no_v12_features.py

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[5334,5403) 新增测试 `tests/test_fcop/test_review_no_v12_features.py` 显式 ASSERT 它们不存在
[5340,5386) tests/test_fcop/test_review_no_v12_features.py
[5334,5336) 新增

A p1:66bca650b34fbf26fb17c5a1 UNRESOLVED REQUIRED 做

Previous: NEW; exact fact unchanged: false

[8853,8893) v1.0.0 RC 需要：(a) schema 存在 [TASK-003 已做]
[8891,8892) 做

A p1:921de810f0433f5937c000d5 UNRESOLVED PERMITTED 发货

Previous: NEW; exact fact unchanged: false

[8931,8963) (c) 新 envelope（REVIEW）可发货 [本任务发]
[8954,8956) 发货

A p1:17ba80eaa5ab8b001d9d9d52 UNRESOLVED PERMITTED 使用

Previous: NEW; exact fact unchanged: false

[8976,9024) 协议**第一次**可端到端使用——而且把原 Issue #2 的头号请求 REVIEW 发出来了
[8989,8991) 使用

A p1:04d66affbbc2d8883f7cd4aa RESOLVED PERMITTED 发 原 Issue #2 的头号请求 REVIEW

Previous: NEW; exact fact unchanged: false

[8976,9024) 协议**第一次**可端到端使用——而且把原 Issue #2 的头号请求 REVIEW 发出来了
[9020,9021) 发
[8996,9019) 原 Issue #2 的头号请求 REVIEW

A p1:262f2bcba1c496b7782b9b28 RESOLVED REQUIRED 触及 src/fcop/core/jsonschema_validator.py、src/fcop/models.py、src/fcop/core/frontmatter.py、tests/

Previous: NEW; exact fact unchanged: false

[9063,9329) 触及 `src/fcop/_data/schemas/`（新建）、`src/fcop/core/jsonschema_validator.py`（新建）、`src/fcop/models.py`（additive）、`src/fcop/core/filename.py`（additive）、`src/fcop/core/frontmatter.py`（additive）、`src/fcop/project.py`（additive）、`src/fcop/__init__.py`（additive）、`tests/`（仅新文件）
[9097,9134) src/fcop/core/jsonschema_validator.py
[9141,9159) src/fcop/models.py
[9210,9238) src/fcop/core/frontmatter.py
[9316,9322) tests/
[9063,9065) 触及

P p1:c5ffc8a5b9a121c3b2d72837 RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[60,73) recipient: ME
[71,73) ME

V p1:b6624aad8ced49c87087f178 RESOLVED adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md

Previous: MATCH; exact fact unchanged: true

[195,255) ref_charter: adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md
[208,255) adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md

V p1:be888c5b4e13c6d4bf9caa17 RESOLVED docs/agents/log/tasks/TASK-20260509-003-ADMIN-to-ME.md

Previous: UNLISTED_SOURCE_SUPPORTED; exact fact unchanged: true

[257,328) ref_predecessor: docs/agents/log/tasks/TASK-20260509-003-ADMIN-to-ME.md
[274,328) docs/agents/log/tasks/TASK-20260509-003-ADMIN-to-ME.md

V p1:6fb826b25cdcae0bbc49c58e RESOLVED ADR-0001

Previous: MATCH; exact fact unchanged: true

[2450,2501) 不要往 `core/schema.py` 上叠——按 ADR-0001 那个模块是**协议常量**模块
[2477,2485) ADR-0001

V p1:47200714546cece564ec747d RESOLVED ADR-0001

Previous: MATCH; exact fact unchanged: true

[2892,2920) __all__` —— 按 ADR-0001 `core
[2906,2914) ADR-0001

V p1:a06bf4d45b6d9d579b89da53 RESOLVED ADR-0017

Previous: MATCH; exact fact unchanged: true

[3095,3127) 字段对齐 [ADR-0017 §design-details]：
[3101,3109) ADR-0017

V p1:30a7f11ee6e61e5cfb60b3db RESOLVED review.schema.json

Previous: UNLISTED_SOURCE_SUPPORTED; exact fact unchanged: true

[4438,4528) - `decision == NEEDS_CHANGES` 但 `required_changes` 为空 → 拒（对齐 review.schema.json 的 if/then）
[4499,4517) review.schema.json

V p1:1d30cfec960a1ed0169a64e0 RESOLVED ADR-0003

Previous: MATCH; exact fact unchanged: true

[5056,5089) 按 ADR-0003 §additive-only：每条都是新符号
[5058,5066) ADR-0003

V p1:3dd8123cbe062ca8c2581eeb RESOLVED 3c35e0e

Previous: NEW; exact fact unchanged: false

[8378,8489) | 测试时 `referencing` 库不可用 | 已经是 `jsonschema>=4.0` 的 transitive dep（TASK-003 R1 / commit 3c35e0e 加的）—— 任务开始前已确认 |
[8465,8472) 3c35e0e
[8380,8402) 测试时 `referencing` 库不可用

C p1:4a95d5f05e9f74553ffbdf3b RESOLVED ## 3 · 验收标准（10 条） 

Previous: MATCH; exact fact unchanged: false

[6083,6102) ## 3 · 验收标准（10 条） 
[6083,6100) ## 3 · 验收标准（10 条）
[6136,6245) | A1 | `src/fcop/_data/schemas/` 含 7 份 `spec/schemas/*.schema.json` 的字节级副本 | `test_bundled_schemas_in_sync` |
[6247,6339) | A2 | `core/jsonschema_validator.py` 暴露 `validate_envelope_frontmatter` + `validate_record`
[6443,6484) | A3 | `tests/test_schemas/test_*.py` × 7
[6541,6672) | A4 | `docs/agents/log/` 下所有真实 0.7.x TASK / REPORT / ISSUE 文件全部通过 ipc-envelope schema（回归 / I5 见证） | `test_legacy_files_validate` |
[6674,6754) | A5 | `Review` dataclass + `ReviewDecision` + `ReviewSubjectType` 在 `models.py`
[6785,6873) | A6 | `core/filename.py` 解析 `REVIEW-{date}-{seq}-{reviewer}-on-{subject}.md` round-trip
[6997,7094) | A7 | `Project.write_review / read_review / list_reviews / archive_review` 在 temp project 上端到端跑通
[7142,7201) | A8 | `decision=needs_changes` 但 `required_changes` 为空 → 拒
[7298,7385) | A9 | `tests/test_fcop/snapshots/public_surface.json` 更新含 4 新方法 + 1 dataclass + 2 enum
[7455,7503) | A10 | REPORT-004 + TASK-004 归档 + commit + push
[6144,6210) src/fcop/_data/schemas/` 含 7 份 `spec/schemas/*.schema.json` 的字节级副本
[6255,6398) core/jsonschema_validator.py` 暴露 `validate_envelope_frontmatter` + `validate_record`；import 时加载 7 份 schema；跨 `$ref` 用 `referencing.Registry` 解析
[6451,6523) tests/test_schemas/test_*.py` × 7，每份 ≥ 3 用例（合法 / 缺必填 / 非法枚举），对齐 ADR-0016
[6549,6639) docs/agents/log/` 下所有真实 0.7.x TASK / REPORT / ISSUE 文件全部通过 ipc-envelope schema（回归 / I5 见证）
[6682,6769) Review` dataclass + `ReviewDecision` + `ReviewSubjectType` 在 `models.py`，从顶层 `fcop` 包导出
[6793,6930) core/filename.py` 解析 `REVIEW-{date}-{seq}-{reviewer}-on-{subject}.md` round-trip；`core/frontmatter.py` parse/serialize review frontmatter
[7005,7113) Project.write_review / read_review / list_reviews / archive_review` 在 temp project 上端到端跑通；`reviews/` 子目录自动创建
[7150,7237) decision=needs_changes` 但 `required_changes` 为空 → 拒；`decision=needs_human`（v1.2 推迟值）→ 拒
[7306,7398) tests/test_fcop/snapshots/public_surface.json` 更新含 4 新方法 + 1 dataclass + 2 enum；完整 pytest 通过
[7463,7538) REPORT-004 + TASK-004 归档 + commit + push，CHANGELOG 加一条 "Unreleased / Added"

B p1:e9d757badafebfd122470b4f RESOLVED FORBIDDEN **仅 opt-in**——现有 caller 完全不变 现有 caller

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[1087,1115) **仅 opt-in**——现有 caller 完全不变
[1101,1110) 现有 caller

B p1:fdda34490a90e8cd20eeb65a UNRESOLVED FORBIDDEN 叠

Previous: UNRESOLVED; exact fact unchanged: true

[2450,2501) 不要往 `core/schema.py` 上叠——按 ADR-0001 那个模块是**协议常量**模块
[2472,2473) 叠

## SWAI-003

A p1:a9f01e7d8aea61e62adcb925 UNRESOLVED REQUIRED why

Previous: UNRESOLVED; exact fact unchanged: true

[618,643) ## 1 · 为什么需要这个任务（why now）
[635,638) why

A p1:34f5b505392d31d7d6199629 RESOLVED REQUIRED 等 envelope 必填字段

Previous: NEW; exact fact unchanged: false

[1409,1424) 等 envelope 必填字段
[1409,1410) 等
[1411,1424) envelope 必填字段

A p1:a7d447d428518e1cdc7674f4 UNRESOLVED REQUIRED 持久化

Previous: NEW; exact fact unchanged: false

[1580,1612) 持久化（如果 caller 要）走 caller 自己的日志系统
[1580,1583) 持久化

A p1:9128dcdad23a4183f59d2d26 UNRESOLVED REQUIRED 执行

Previous: NEW; exact fact unchanged: false

[3230,3232) 执行

A p1:11771fc5cf7515c5e5b2c8f2 RESOLVED REQUIRED 后剩

Previous: NEW; exact fact unchanged: false

[7619,7623) 完成后剩
[7621,7623) 后剩

A p1:e91991996803eacda8b1a999 RESOLVED REQUIRED 拒收 预设

Previous: NEW; exact fact unchanged: false

[7853,7858) 拒收预设：
[7853,7855) 拒收
[7855,7857) 预设

P p1:b2f5747db1df80b6b811b486 RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[60,73) recipient: ME
[71,73) ME

V p1:109b1c29129cd5c1be3d86aa RESOLVED adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md

Previous: MATCH; exact fact unchanged: true

[195,255) ref_charter: adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md
[208,255) adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md

V p1:ed1d934b1fdea6bfdf7aa279 RESOLVED adr/ADR-0019-failure-and-recovery-semantics.md

Previous: MATCH; exact fact unchanged: true

[257,312) ref_adr: adr/ADR-0019-failure-and-recovery-semantics.md
[266,312) adr/ADR-0019-failure-and-recovery-semantics.md

V p1:8d70f00df5b1dd678f4ba580 RESOLVED docs/agents/log/tasks/TASK-20260509-005-ADMIN-to-ME.md

Previous: UNLISTED_SOURCE_SUPPORTED; exact fact unchanged: true

[314,385) ref_predecessor: docs/agents/log/tasks/TASK-20260509-005-ADMIN-to-ME.md
[331,385) docs/agents/log/tasks/TASK-20260509-005-ADMIN-to-ME.md

V p1:7c56784a14df4d644c36a355 RESOLVED ADR-0019 §context

Previous: NEW; exact fact unchanged: false

[647,683) 外部架构反馈最尖锐的一刀（per ADR-0019 §context）：
[664,681) ADR-0019 §context

V p1:3ee0711b8b5ab8ac7c02125d RESOLVED ADR-0019 §session-recovery-hook

Previous: NEW; exact fact unchanged: false

[2899,2993) per ADR-0019 §session-recovery-hook 与 `failure.schema.json#/$defs/sessionRecoveryAction` enum：
[2903,2934) ADR-0019 §session-recovery-hook

V p1:0b3d4630c6b2d0171117eff1 RESOLVED failure.schema.json

Previous: NEW; exact fact unchanged: false

[2899,2993) per ADR-0019 §session-recovery-hook 与 `failure.schema.json#/$defs/sessionRecoveryAction` enum：
[2938,2957) failure.schema.json

V p1:df714b0723e7fe3cb4c992a7 RESOLVED ADR-0019 §open-question

Previous: NEW; exact fact unchanged: false

[4311,4361) - DRIFT 自动检测 → 永远不做（per ADR-0019 §open-question 1）
[4335,4358) ADR-0019 §open-question

V p1:e08b53d0260bf23a24d8720c RESOLVED ADR-0003

Previous: NEW; exact fact unchanged: false

[6991,7002) | 公开面 +13 项
[7045,7053) ADR-0003
[6993,7018) 公开面 +13 项，snapshot diff 大

C p1:b4477feaab03ffbe889450fb RESOLVED ## 3 · 验收标准（12 条） 

Previous: NEW; exact fact unchanged: false

[4566,4585) ## 3 · 验收标准（12 条） 
[4566,4583) ## 3 · 验收标准（12 条）
[4619,4649) | A1 | `core/recovery.py` 模块存在
[4732,4939) | A2 | `models.Failure` / `models.Recovery` / `models.RetryPlan` / `models.ResumePayload` / `models.RollbackPlan` / `models.RecoveryOutcome` / `models.SessionRecoveryResult` 公开 dataclass | import smoketest |
[4941,5080) | A3 | `models.FailureType` enum（TIMEOUT/CRASH/DEADLOCK/DRIFT）+ `RecoveryAction` enum（5 类）+ `SessionRecoveryAction` enum（3 类） | enum 长度断言 |
[5082,5136) | A4 | `Project.report_failure(failure) -> Receipt` 工作
[5189,5227) | A5 | `Project.apply_recovery(failure
[5358,5400) | A6 | `Project.recover_session(session_id
[5495,5547) | A7 | `core/recovery.py` 5 个 reference impl 函数（pure
[5596,5718) | A8 | failure record 通过 `failure.schema.json` 的 `validate_record` 校验（schema 强制对齐） | `test_failure_record_schema_compat` |
[5720,5790) | A9 | session_recovery_call 的 action enum 只允许 3 值（RETRY / ESCALATE 被拒
[5852,5953) | A10 | snapshot 更新含 +N 公开符号（约 7 dataclass + 3 enum + 3 方法 = 13 项 added） | `test_public_surface` 通过 |
[5955,6050) | A11 | ADR-0019 状态从 Proposed → Accepted + Sign-off 段填实 + Tests Checklist 标 [x] | adr 文件 diff |
[6052,6154) | A12 | REPORT-006 + 归档 + commit + push + CHANGELOG 加 Unreleased / Added 条目 | git log + CHANGELOG.md |
[4627,4689) core/recovery.py` 模块存在；export 5 类 Recovery 的 reference impl 函数
[4740,4918) models.Failure` / `models.Recovery` / `models.RetryPlan` / `models.ResumePayload` / `models.RollbackPlan` / `models.RecoveryOutcome` / `models.SessionRecoveryResult` 公开 dataclass
[4949,5066) models.FailureType` enum（TIMEOUT/CRASH/DEADLOCK/DRIFT）+ `RecoveryAction` enum（5 类）+ `SessionRecoveryAction` enum（3 类）
[5090,5153) Project.report_failure(failure) -> Receipt` 工作；触发 stub 事件可被测试观察
[5197,5322) Project.apply_recovery(failure, action=None)` 5 类 Recovery 各 ≥ 1 用例（RETRY/RESUME/ROLLBACK 只读；ABORT 写 REPORT；ESCALATE 写 ISSUE）
[5366,5458) Project.recover_session(session_id, action)` 接受两种 session_id 形状 + 3 类 action；非法 action raise
[5503,5562) core/recovery.py` 5 个 reference impl 函数（pure，不依赖 Project）单测
[5603,5678) failure record 通过 `failure.schema.json` 的 `validate_record` 校验（schema 强制对齐）
[5727,5808) session_recovery_call 的 action enum 只允许 3 值（RETRY / ESCALATE 被拒；测试见证 v1.2 推迟值不偷塞）
[5860,5924) snapshot 更新含 +N 公开符号（约 7 dataclass + 3 enum + 3 方法 = 13 项 added）
[5963,6034) ADR-0019 状态从 Proposed → Accepted + Sign-off 段填实 + Tests Checklist 标 [x]
[6060,6127) REPORT-006 + 归档 + commit + push + CHANGELOG 加 Unreleased / Added 条目

B p1:02345b4a097a01d1f1f7e807 RESOLVED FORBIDDEN 写 盘

Previous: NEW; exact fact unchanged: false

[1534,1537) 不写盘
[1535,1536) 写
[1536,1537) 盘

## SWAI-004

O p1:b20748d81363f058115ba717 RESOLVED dry-run

Previous: NEW; exact fact unchanged: false

[1785,1840) 输出 `[dry-run]` summary 含 source/target/strategy/entries
[1790,1797) dry-run
[1785,1787) 输出
[1833,1840) entries

O p1:041fbc7680a8d86062652abd RESOLVED entries

Previous: NEW; exact fact unchanged: false

[1785,1840) 输出 `[dry-run]` summary 含 source/target/strategy/entries
[1790,1797) dry-run
[1785,1787) 输出
[1833,1840) entries

O p1:28ede995da905e78b489f3eb RESOLVED ABORT

Previous: NEW; exact fact unchanged: false

[2043,2053) 输出 `ABORT`
[2043,2045) 输出
[2047,2052) ABORT

A p1:8e82381481a63c9c7c61d858 UNRESOLVED REQUIRED why

Previous: UNRESOLVED; exact fact unchanged: true

[563,588) ## 1 · 为什么需要这个任务（why now）
[580,583) why

A p1:000a25f96cd97f68d6cd5132 RESOLVED REQUIRED 配 自动迁移工具

Previous: NEW; exact fact unchanged: false

[592,655) ADR-0022 §"Decision §3" 明确："必须配自动迁移工具——`fcop migrate-workspace`
[622,623) 配
[623,629) 自动迁移工具

A p1:34c3c3495ff934de6809408a UNRESOLVED REQUIRED 命令

Previous: NEW; exact fact unchanged: false

[657,664) 命令一键迁移"
[657,659) 命令

A p1:1e842f6236ac0bce7728a4e4 RESOLVED REQUIRED 输出 dry-run、entries

Previous: NEW; exact fact unchanged: false

[1785,1840) 输出 `[dry-run]` summary 含 source/target/strategy/entries
[1790,1797) dry-run
[1785,1787) 输出
[1833,1840) entries

A p1:3832e6a0e608b582f03b1919 UNRESOLVED PERMITTED 见

Previous: NEW; exact fact unchanged: false

[1948,1963) `git status` 可见
[1962,1963) 见
[1949,1959) git status

A p1:933b4b60248b68d388b3347b RESOLVED REQUIRED 输出 ABORT

Previous: NEW; exact fact unchanged: false

[2043,2053) 输出 `ABORT`
[2043,2045) 输出
[2047,2052) ABORT

P p1:c3acb9b346bd661507743cec RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[60,73) recipient: ME
[71,73) ME

V p1:9954be77446ff666d6fca13f RESOLVED adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md

Previous: MATCH; exact fact unchanged: true

[193,253) ref_charter: adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md
[206,253) adr/ADR-0015-fcop-1.0-ai-os-protocol-charter.md

V p1:455ddd1e59f9223b27f78993 RESOLVED adr/ADR-0022-workspace-directory-convention.md

Previous: MATCH; exact fact unchanged: true

[255,310) ref_adr: adr/ADR-0022-workspace-directory-convention.md
[264,310) adr/ADR-0022-workspace-directory-convention.md

V p1:07637d66d94b37a6964fb4e5 RESOLVED docs/agents/log/tasks/TASK-20260509-007-ADMIN-to-ME.md

Previous: UNLISTED_SOURCE_SUPPORTED; exact fact unchanged: true

[312,383) ref_predecessor: docs/agents/log/tasks/TASK-20260509-007-ADMIN-to-ME.md
[329,383) docs/agents/log/tasks/TASK-20260509-007-ADMIN-to-ME.md

V p1:6ae9641988386cb7fa655ecd RESOLVED ADR-0022

Previous: NEW; exact fact unchanged: false

[2834,2909) | 顾问扫描误报 prose 中的 `docs/agents` | 按 ADR-0022 §"Design Details" item 3 显式不改写
[2870,2878) ADR-0022
[2836,2864) 顾问扫描误报 prose 中的 `docs/agents

C p1:dbaab0e6daa5a817258660e5 RESOLVED ## 3 · 验收标准（acceptance criteria） 

Previous: NEW; exact fact unchanged: false

[1682,1716) ## 3 · 验收标准（acceptance criteria） 
[1682,1714) ## 3 · 验收标准（acceptance criteria）
[1718,1719) 1
[1768,1769) 2
[1842,1843) 3
[1902,1903) 4
[1965,1966) 5
[2006,2007) 6
[2055,2056) 7
[2116,2117) 8
[1718,1766) 1. ✅ `fcop migrate-workspace --help` 退出 0；列出所有选项
[1768,1840) 2. ✅ Dry-run 不动盘，输出 `[dry-run]` summary 含 source/target/strategy/entries
[1842,1900) 3. ✅ `--apply` 实际把 `docs/agents/` 移到 `fcop/`，并写 breadcrumb
[1902,1963) 4. ✅ git 工作区 + tracked path 时使用 `git mv`，保留历史；`git status` 可见
[1965,2004) 5. ✅ 已迁移的 tree 上 `--apply` 是 no-op，退出 0
[2006,2052) 6. ✅ both-exist 时 `--apply` 退出 2，不动盘，输出 `ABORT
[2055,2114) 7. ✅ 顾问扫描列出 `.gitignore` / `README.md` 等含 `docs/agents` 的文件
[2116,2172) 8. ✅ bare `fcop`（无 subcommand）仍打印 0.5→0.6 legacy 信息，退出 1

B p1:59db589e5b2e7c96a5dbbbbb RESOLVED FORBIDDEN 依赖 Project

Previous: WRONG_BINDING; exact fact unchanged: true

[811,828) 不依赖 `Project` 改造）
[812,814) 依赖
[816,823) Project

B p1:8c5e00e608139220e634481f RESOLVED FORBIDDEN 动 盘

Previous: NEW; exact fact unchanged: false

[2039,2042) 不动盘
[2040,2041) 动
[2041,2042) 盘

## SWAI-006

A p1:6a39c71859f63ceb7036c2bb RESOLVED REQUIRED 落 文件

Previous: NEW; exact fact unchanged: false

[823,852) 必须落文件**——这正是 FCoP 的根原则(Rule 0
[825,826) 落
[826,828) 文件

A p1:6ccdfc2739beefec2c3f8677 UNRESOLVED REQUIRED 引用 这串 commit

Previous: NEW; exact fact unchanged: false

[1280,1340) - 引用 `d2ed13c → cc60186 → 979bcd2 → dfe68e3` 这串 commit 作为"反面
[1282,1284) 引用
[1325,1334) 这串 commit

A p1:e6e767c93c046d6cd112da8a RESOLVED REQUIRED 用 显式路径

Previous: NEW; exact fact unchanged: false

[1898,1952) - [ ] **Dogfood**:本任务的 commit 阶段 **必须用显式路径** `git add`
[1935,1936) 用
[1936,1940) 显式路径

P p1:953d409c5b906f1e46c40e73 RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[88,101) recipient: ME
[99,101) ME

V p1:de9f940ff6a41eb7b44b75c5 RESOLVED TASK-20260513-001

Previous: UNLISTED_SOURCE_SUPPORTED; exact fact unchanged: true

[248,288) - TASK-20260513-001   # SOP v2 沉淀主刀(已归档)
[250,267) TASK-20260513-001

V p1:de9f9541309ef78570862f98 RESOLVED REPORT-20260513-001

Previous: UNLISTED_SOURCE_SUPPORTED; exact fact unchanged: true

[292,313) - REPORT-20260513-001
[294,313) REPORT-20260513-001

C p1:63fd85ed123c2b2a9f29bd3c RESOLVED ## 验收 / Acceptance 

Previous: NEW; exact fact unchanged: false

[1608,1628) ## 验收 / Acceptance 
[1608,1626) ## 验收 / Acceptance
[1630,1674) - [ ] `docs/release-process.md` 阶段 4 闭环段命令重写
[1682,1730) - [ ] `docs/release-process.md` 常见故障新增 "问题 7" 整段
[1732,1791) - [ ] 两处都明确指向 `d2ed13c` / `cc60186` / `979bcd2` / `dfe68e3`
[1820,1896) - [ ] 写 `REPORT-20260513-002-ME-to-ADMIN-add-git-add-explicit-paths-rule.md`
[1898,1952) - [ ] **Dogfood**:本任务的 commit 阶段 **必须用显式路径** `git add`
[2064,2089) - [ ] push origin main 成功
[1630,1680) - [ ] `docs/release-process.md` 阶段 4 闭环段命令重写,显式列路径
[1732,1818) - [ ] 两处都明确指向 `d2ed13c` / `cc60186` / `979bcd2` / `dfe68e3`       作为依据(commit hash 短)
[1820,1895) - [ ] 写 `REPORT-20260513-002-ME-to-ADMIN-add-git-add-explicit-paths-rule.md
[1898,2062) - [ ] **Dogfood**:本任务的 commit 阶段 **必须用显式路径** `git add`,       不许再用 `-A`;commit 前 `git status --short` 确认 staging 区只       包含本意 3 个文件(docs + TASK-002 + REPORT-002)
[2064,2110) - [ ] push origin main 成功,main 历史保持单 commit 干净

B p1:7bc8a77613a365391d03b4ef RESOLVED FORBIDDEN 抓 残留

Previous: NEW; exact fact unchanged: false

[1148,1186) - ❌ 不要 `git add -A`(会抓所有 untracked 残留)
[1169,1170) 抓
[1183,1185) 残留

## SWAI-007

I p1:8898f65dfd9345d48814cce3 RESOLVED roles/ADMIN.md

Previous: NEW; exact fact unchanged: false

[2361,2400) - [ ] **没有** `roles/ADMIN.md`(ADMIN 是真人
[2375,2389) roles/ADMIN.md

A p1:2d991b3e30b8cfd8330df14e UNRESOLVED REQUIRED 断

Previous: NEW; exact fact unchanged: false

[1937,1939) 断)
[1937,1938) 断

A p1:d1947f739cab3960171387c1 UNRESOLVED PERMITTED 选

Previous: NEW; exact fact unchanged: false

[2580,2582) 可选
[2581,2582) 选

A p1:a1b4e7aebc7b0e38d53659ed RESOLVED REQUIRED 给出 建议

Previous: NEW; exact fact unchanged: false

[3824,3836) 需在报告中说明并给出建议
[3832,3834) 给出
[3834,3836) 建议

A p1:11c42304981298b34763e3e0 UNRESOLVED REQUIRED 说明

Previous: NEW; exact fact unchanged: false

[3824,3836) 需在报告中说明并给出建议
[3829,3831) 说明

P p1:e176fb5212d1f885d3a14bc7 RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[88,101) recipient: ME
[99,101) ME

R p1:bfad5582b14c8b9d851c6278 RESOLVED 7

Previous: NEW; exact fact unchanged: false

[3317,3341) - [ ] 哑火(任务存在 ≥7 天无回应)清单
[3331,3338) ≥7 天无回应
[3332,3333) 7

V p1:2cde3db5c941ae39e8d51a62 RESOLVED b4dc1f7

Previous: NEW; exact fact unchanged: false

[4195,4207) 见 `b4dc1f7`)
[4198,4205) b4dc1f7

C p1:38e009d64099f9a9d811d3d3 RESOLVED ## 验收 / Acceptance 

Previous: NEW; exact fact unchanged: false

[3883,3903) ## 验收 / Acceptance 
[3883,3901) ## 验收 / Acceptance
[3905,3984) - [ ] 写出 `REPORT-20260513-003-ME-to-ADMIN-codeflow-cross-project-fcop-audit.md`
[4018,4055) - [ ] 每条结论附**事实出处**(路径 + 文件名 + 行号或字段)
[4102,4130) - [ ] 不在 codeflow-3 仓库下写任何文件
[4132,4182) - [ ] 本任务 commit 时严格遵守新立的 `git add` 显式路径硬约束(SOP v2
[3905,4016) - [ ] 写出 `REPORT-20260513-003-ME-to-ADMIN-codeflow-cross-project-fcop-audit.md`,       按 P0 / P1 / P2 分级列出全部问题
[4018,4100) - [ ] 每条结论附**事实出处**(路径 + 文件名 + 行号或字段)。Rule 0.c       不允许"我以为是这样",写"unverified"也合法
[4132,4207) - [ ] 本任务 commit 时严格遵守新立的 `git add` 显式路径硬约束(SOP v2       问题 7,见 `b4dc1f7`)

B p1:fcad429261e995da53931aeb UNRESOLVED FORBIDDEN 落任

Previous: NEW; exact fact unchanged: false

[1176,1193) 不在 codeflow 仓库下落任
[1191,1193) 落任

B p1:ab204da9a4ea3e8efcc3f068 RESOLVED FORBIDDEN 自命 `codeflow.PM`

Previous: NEW; exact fact unchanged: false

[1303,1323) 严禁自命 `codeflow.PM` /
[1305,1307) 自命
[1308,1321) `codeflow.PM`

B p1:df6770c7b52b029b97b2a1eb RESOLVED FORBIDDEN 入 roles/

Previous: NEW; exact fact unchanged: false

[2401,2411) 不入 roles/)
[2404,2410) roles/
[2402,2403) 入

B p1:0e3fca22f3a34b2fdc08e14c RESOLVED FORBIDDEN 冒充 ADMIN

Previous: NEW; exact fact unchanged: false

[3058,3070) 不冒充 `ADMIN`)
[3059,3061) 冒充
[3063,3068) ADMIN

## SWAI-008

I p1:961b2c105c3fcc8ca8396a26 RESOLVED src/fcop/project.py

Previous: NEW; exact fact unchanged: false

[576,687) - 看 `src/fcop/project.py`、`src/fcop/cli/_main.py`、`src/fcop/cli/migrate_v3.py`、`src/fcop/lifecycle/migrate.py`：
[581,600) src/fcop/project.py
[578,579) 看

I p1:4688b99b6ae5b8ce1049054a RESOLVED src/fcop/cli/_main.py

Previous: NEW; exact fact unchanged: false

[576,687) - 看 `src/fcop/project.py`、`src/fcop/cli/_main.py`、`src/fcop/cli/migrate_v3.py`、`src/fcop/lifecycle/migrate.py`：
[603,624) src/fcop/cli/_main.py
[578,579) 看

I p1:8d09578f86935e9e2ebf917d RESOLVED src/fcop/cli/migrate_v3.py

Previous: NEW; exact fact unchanged: false

[576,687) - 看 `src/fcop/project.py`、`src/fcop/cli/_main.py`、`src/fcop/cli/migrate_v3.py`、`src/fcop/lifecycle/migrate.py`：
[627,653) src/fcop/cli/migrate_v3.py
[578,579) 看

I p1:a0f6f95c4eebc7ec30ae4816 RESOLVED src/fcop/lifecycle/migrate.py

Previous: NEW; exact fact unchanged: false

[576,687) - 看 `src/fcop/project.py`、`src/fcop/cli/_main.py`、`src/fcop/cli/migrate_v3.py`、`src/fcop/lifecycle/migrate.py`：
[656,685) src/fcop/lifecycle/migrate.py
[578,579) 看

I p1:ea67e4a0890771200de49453 RESOLVED spec/fcop-3.0-spec.md` 描述的 `_lifecycle/{inbox,active,review,done,archive}/

Previous: NEW; exact fact unchanged: false

[1112,1263) - 对比 `spec/fcop-3.0-spec.md` 描述的 `_lifecycle/{inbox,active,review,done,archive}/` 与 `src/fcop/lifecycle/state.py`、`src/fcop/lifecycle/migrate.py` 实际实现：
[1114,1116) 对比
[1118,1192) spec/fcop-3.0-spec.md` 描述的 `_lifecycle/{inbox,active,review,done,archive}/

I p1:4d9cc7c0cefd4ea3ea9cc7d7 RESOLVED `src/fcop/lifecycle/state.py`、`src/fcop/lifecycle/migrate.py` 实际实现

Previous: NEW; exact fact unchanged: false

[1112,1263) - 对比 `spec/fcop-3.0-spec.md` 描述的 `_lifecycle/{inbox,active,review,done,archive}/` 与 `src/fcop/lifecycle/state.py`、`src/fcop/lifecycle/migrate.py` 实际实现：
[1114,1116) 对比
[1196,1262) `src/fcop/lifecycle/state.py`、`src/fcop/lifecycle/migrate.py` 实际实现

A p1:9abe763d9f04210b26f9cbd0 RESOLVED REQUIRED 看 src/fcop/project.py、src/fcop/cli/_main.py、src/fcop/cli/migrate_v3.py、src/fcop/lifecycle/migrate.py

Previous: NEW; exact fact unchanged: false

[576,687) - 看 `src/fcop/project.py`、`src/fcop/cli/_main.py`、`src/fcop/cli/migrate_v3.py`、`src/fcop/lifecycle/migrate.py`：
[581,600) src/fcop/project.py
[603,624) src/fcop/cli/_main.py
[627,653) src/fcop/cli/migrate_v3.py
[656,685) src/fcop/lifecycle/migrate.py
[578,579) 看

A p1:e4b2fdcc167d7f32630747a3 RESOLVED REQUIRED 看 CHANGELOG.md、git log

Previous: NEW; exact fact unchanged: false

[893,943) - 看 `fcop/fcop.json`、`CHANGELOG.md`、最近的 `git log`：
[915,927) CHANGELOG.md
[895,896) 看
[934,941) git log

A p1:2647a262e4527a7794cc15bb RESOLVED REQUIRED 对比 spec/fcop-3.0-spec.md` 描述的 `_lifecycle/{inbox,active,review,done,archive}/、`src/fcop/lifecycle/state.py`、`src/fcop/lifecycle/migrate.py` 实际实现

Previous: NEW; exact fact unchanged: false

[1112,1263) - 对比 `spec/fcop-3.0-spec.md` 描述的 `_lifecycle/{inbox,active,review,done,archive}/` 与 `src/fcop/lifecycle/state.py`、`src/fcop/lifecycle/migrate.py` 实际实现：
[1114,1116) 对比
[1118,1192) spec/fcop-3.0-spec.md` 描述的 `_lifecycle/{inbox,active,review,done,archive}/
[1196,1262) `src/fcop/lifecycle/state.py`、`src/fcop/lifecycle/migrate.py` 实际实现

A p1:8fe0c6fcbcb8c460dd4f8c4b UNRESOLVED REQUIRED 包含

Previous: NEW; exact fact unchanged: false

[1575,1587) REPORT 必须包含：
[1584,1586) 包含
[1575,1581) REPORT

A p1:a44640d63b4fd35b4e5b4a47 UNRESOLVED REQUIRED 决定

Previous: NEW; exact fact unchanged: false

[1860,1879) 由 ADMIN 决定是否新开 TASK
[1868,1870) 决定

A p1:c99e0038790ef61630255a17 RESOLVED REQUIRED 查 未验证

Previous: NEW; exact fact unchanged: false

[1943,1955) 查不到 = 写「未验证」
[1943,1944) 查
[1951,1954) 未验证

P p1:da12988974ff775a01049b50 RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[44,57) recipient: ME
[55,57) ME

C p1:0e8c6f8aedfc0f69ab5b0291 RESOLVED ## 验收标准 / Acceptance 

Previous: NEW; exact fact unchanged: false

[1553,1574) ## 验收标准 / Acceptance 
[1553,1573) ## 验收标准 / Acceptance
[1588,1627) - Q1~Q4 各一段结论 + 证据（文件路径 + 行号 / 命令 + 输出）
[1628,1641) - 一份「下一步建议」清单
[1743,1762) - **不得**自己动手修任何这些文件
[1628,1742) - 一份「下一步建议」清单，给 ADMIN 三选一/多选：   - 修代码（让 init 默认落 v3 拓扑）   - 改一封信（按现状回退 v3 措辞，去掉假设性陈述）   - 改 README（加 v3.0 安装/迁移章节）

B p1:8fbd797c8448832d52ae1d46 RESOLVED FORBIDDEN 修改 .md、.py

Previous: NEW; exact fact unchanged: false

[487,518) 本任务**禁止**修改任何 `.md` / `.py` 源文件
[502,505) .md
[510,513) .py
[496,498) 修改

B p1:e428c4013a65f45a40110000 UNRESOLVED FORBIDDEN 填空

Previous: NEW; exact fact unchanged: false

[1956,1960) 不要填空
[1958,1960) 填空

## SWAI-009

O p1:19d2029f37ef959f2a8ea623 RESOLVED agent-bringup-prompt 双语防呆 prompt

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[247,295) # TASK-006 · 起草 agent-bringup-prompt 双语防呆 prompt
[260,262) 起草
[263,295) agent-bringup-prompt 双语防呆 prompt

O p1:2d65873f6ef46f2ead3102d1 RESOLVED `agent-bringup-prompt` 双语档（zh + en）

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[1224,1263) 落一份 `agent-bringup-prompt` 双语档（zh + en）
[1224,1225) 落
[1251,1254) 双语档
[1228,1263) `agent-bringup-prompt` 双语档（zh + en）

O p1:548d478316085f2233b5f52d RESOLVED src/fcop/rules/_data/agent-bringup-prompt.zh.md

Previous: MATCH; exact fact unchanged: true

[1398,1409) **新建文件**（双语
[1428,1479) - `src/fcop/rules/_data/agent-bringup-prompt.zh.md`
[1431,1478) src/fcop/rules/_data/agent-bringup-prompt.zh.md
[1484,1535) - `src/fcop/rules/_data/agent-bringup-prompt.en.md`
[1487,1534) src/fcop/rules/_data/agent-bringup-prompt.en.md
[1400,1402) 新建

O p1:108be9b49d9425342386c1ad RESOLVED src/fcop/rules/_data/agent-bringup-prompt.en.md

Previous: MATCH; exact fact unchanged: true

[1398,1409) **新建文件**（双语
[1428,1479) - `src/fcop/rules/_data/agent-bringup-prompt.zh.md`
[1431,1478) src/fcop/rules/_data/agent-bringup-prompt.zh.md
[1484,1535) - `src/fcop/rules/_data/agent-bringup-prompt.en.md`
[1487,1534) src/fcop/rules/_data/agent-bringup-prompt.en.md
[1400,1402) 新建

A p1:3b08c2044e9ef36a0cd905c8 RESOLVED REQUIRED 起草 agent-bringup-prompt 双语防呆 prompt

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[247,295) # TASK-006 · 起草 agent-bringup-prompt 双语防呆 prompt
[260,262) 起草
[263,295) agent-bringup-prompt 双语防呆 prompt

A p1:4912917cc1bf41101d05761c UNRESOLVED REQUIRED 验证

Previous: NEW; exact fact unchanged: false

[376,378) 验证

A p1:d38b09ccacd4e581905c5f2c RESOLVED REQUIRED 落 双语档、`agent-bringup-prompt` 双语档（zh + en）

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[1224,1263) 落一份 `agent-bringup-prompt` 双语档（zh + en）
[1224,1225) 落
[1251,1254) 双语档
[1228,1263) `agent-bringup-prompt` 双语档（zh + en）

A p1:8f251c70f92e6ff258f7b6d4 RESOLVED REQUIRED 新建 src/fcop/rules/_data/agent-bringup-prompt.zh.md、src/fcop/rules/_data/agent-bringup-prompt.en.md

Previous: MATCH; exact fact unchanged: true

[1398,1409) **新建文件**（双语
[1428,1479) - `src/fcop/rules/_data/agent-bringup-prompt.zh.md`
[1431,1478) src/fcop/rules/_data/agent-bringup-prompt.zh.md
[1484,1535) - `src/fcop/rules/_data/agent-bringup-prompt.en.md`
[1487,1534) src/fcop/rules/_data/agent-bringup-prompt.en.md
[1400,1402) 新建

A p1:8011f6d0671f0f057c2eca27 UNRESOLVED PERMITTED 解析

Previous: NEW; exact fact unchanged: false

[4083,4148) ✅ MCP 资源 `fcop://prompt/bringup` / `fcop://prompt/bringup.en` 可解析
[4146,4148) 解析

A p1:f49afe3dd553db8530b8cd16 UNRESOLVED REQUIRED 建议

Previous: NEW; exact fact unchanged: false

[4672,4686) 建议本次会话内完成草稿+验收
[4672,4674) 建议

A p1:e98a078898f4e53058fe26fd UNRESOLVED REQUIRED 观察

Previous: NEW; exact fact unchanged: false

[4778,4786) 观察到笨模型翻车
[4778,4780) 观察

P p1:c82501e0636253bd7f9e1e5a RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[88,101) recipient: ME
[99,101) ME

V p1:fdedac348f0007f6bbb92622 RESOLVED TASK-20260522-005

Previous: UNLISTED_SOURCE_SUPPORTED; exact fact unchanged: true

[210,238) related: [TASK-20260522-005]
[220,237) TASK-20260522-005

C p1:d966e83c6e30afd9b93c5236 RESOLVED ## 验收标准 / Acceptance Criteria 

Previous: NEW; exact fact unchanged: false

[3862,3893) ## 验收标准 / Acceptance Criteria 
[3862,3891) ## 验收标准 / Acceptance Criteria
[3895,3896) 1
[3966,3967) 2
[4034,4035) 3
[4080,4081) 4
[4194,4195) 5
[4232,4233) 6
[4375,4376) 7
[4429,4430) 8
[3895,3963) 1. ✅ `src/fcop/rules/_data/agent-bringup-prompt.{zh,en}.md` 存在，五段式齐全
[3966,4031) 2. ✅ §3 边界声明显式区分 MCP 工具 vs Python API，含 anti-pattern 清单    ≥ 4 条
[4034,4077) 3. ✅ §5 验证 `_lifecycle` 五桶（明确点名 3.0.2 修复重点）
[4080,4191) 4. ✅ MCP 资源 `fcop://prompt/bringup` / `fcop://prompt/bringup.en` 可解析    （或文档说明留白到下次 release 处理，本次先把文件落进 wheel）
[4194,4229) 5. ✅ README.md / README.zh.md 加入索引行
[4232,4372) 6. ✅ 跑一次 `python scripts/release_audit.py` 看是否触发文档相关 P0 / P1    （新增 prompt 不应该触发 drift；如果触发了，把 RULES-release-file-inventory.md    §2 同步更新）
[4375,4426) 7. ✅ 跑一次 `python scripts/inventory_drift.py` 三类警告清零
[4429,4463) 8. ✅ 写 REPORT-006，archive TASK-006

B p1:9de1abc0a3419ad8f7f517bc RESOLVED FORBIDDEN 改 agent-install-prompt.zh.md` 现有内容

Previous: NEW; exact fact unchanged: false

[3652,3701) - 不改 `agent-install-prompt.zh.md` 现有内容（它只管"装 mcp"
[3655,3656) 改
[3658,3690) agent-install-prompt.zh.md` 现有内容

B p1:864e410a878d9a774b56ef15 RESOLVED FORBIDDEN 混进 内容

Previous: NEW; exact fact unchanged: false

[3711,3728) 不要混进 bringup 的内容）
[3713,3715) 混进
[3725,3727) 内容

B p1:80476e1193779e488b81d7fd RESOLVED FORBIDDEN 动 LETTER-TO-ADMIN.md

Previous: NEW; exact fact unchanged: false

[3731,3771) - 不动 `LETTER-TO-ADMIN.md`（3.0.2 已经更新过摘要块
[3737,3755) LETTER-TO-ADMIN.md
[3734,3735) 动

B p1:73cb2c9186b50a3b77e908c0 RESOLVED FORBIDDEN 做 工具层 anti-pattern 防呆

Previous: NEW; exact fact unchanged: false

[3782,3820) - 不做"工具层 anti-pattern 防呆"（那是 v3.1.x 候选
[3785,3786) 做
[3787,3806) 工具层 anti-pattern 防呆

B p1:b1eb416edc3f6c745a51709e RESOLVED FORBIDDEN 触发 drift

Previous: NEW; exact fact unchanged: false

[4297,4319) （新增 prompt 不应该触发 drift
[4311,4313) 触发
[4314,4319) drift

B p1:0c907162d8350d53b2091617 RESOLVED FORBIDDEN 发 新版本

Previous: NEW; exact fact unchanged: false

[4492,4521) - 不发新版本（这是 3.0.2 后的小幅 docs 增补
[4495,4496) 发
[4496,4499) 新版本

B p1:8e31b13788cae7f50f0bc328 RESOLVED FORBIDDEN 改 协议规则

Previous: NEW; exact fact unchanged: false

[4547,4598) - 不改协议规则（`fcop-rules.mdc` / `fcop-protocol.mdc` 不动）
[4550,4551) 改
[4551,4555) 协议规则

B p1:4887ec66c8508b4d28827960 RESOLVED FORBIDDEN 动 既有 `agent-install-prompt.zh.md` 的内容定位

Previous: NEW; exact fact unchanged: false

[4601,4642) - 不动既有 `agent-install-prompt.zh.md` 的内容定位
[4604,4605) 动
[4605,4642) 既有 `agent-install-prompt.zh.md` 的内容定位

B p1:d81aba8b5047a700db74de0c UNRESOLVED FORBIDDEN 在 本

Previous: NEW; exact fact unchanged: false

[4849,4857) 不在本 task
[4850,4851) 在
[4851,4852) 本

## SWAI-010

O p1:a6b75cb4ad5f5a72fafcf834 RESOLVED `agent-bringup-prompt` 双语档（zh + en）

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[1393,1432) 落一份 `agent-bringup-prompt` 双语档（zh + en）
[1393,1394) 落
[1420,1423) 双语档
[1397,1432) `agent-bringup-prompt` 双语档（zh + en）

O p1:8df3e3ed48d0f63978e14e71 RESOLVED src/fcop/rules/_data/agent-bringup-prompt.zh.md

Previous: MATCH; exact fact unchanged: true

[1588,1595) 新建文件（双语
[1612,1663) - `src/fcop/rules/_data/agent-bringup-prompt.zh.md`
[1615,1662) src/fcop/rules/_data/agent-bringup-prompt.zh.md
[1665,1716) - `src/fcop/rules/_data/agent-bringup-prompt.en.md`
[1668,1715) src/fcop/rules/_data/agent-bringup-prompt.en.md
[1588,1590) 新建

O p1:9c5dc56430fa89f6ca74df90 RESOLVED src/fcop/rules/_data/agent-bringup-prompt.en.md

Previous: MATCH; exact fact unchanged: true

[1588,1595) 新建文件（双语
[1612,1663) - `src/fcop/rules/_data/agent-bringup-prompt.zh.md`
[1615,1662) src/fcop/rules/_data/agent-bringup-prompt.zh.md
[1665,1716) - `src/fcop/rules/_data/agent-bringup-prompt.en.md`
[1668,1715) src/fcop/rules/_data/agent-bringup-prompt.en.md
[1588,1590) 新建

A p1:1cb84445e554f74adde47b12 UNRESOLVED REQUIRED 验证

Previous: NEW; exact fact unchanged: false

[786,788) 验证

A p1:574cd12ea03f363ea875d438 RESOLVED REQUIRED 落 双语档、`agent-bringup-prompt` 双语档（zh + en）

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[1393,1432) 落一份 `agent-bringup-prompt` 双语档（zh + en）
[1393,1394) 落
[1420,1423) 双语档
[1397,1432) `agent-bringup-prompt` 双语档（zh + en）

A p1:04f2540276d6bc0c78f3ef16 RESOLVED REQUIRED 新建 src/fcop/rules/_data/agent-bringup-prompt.zh.md、src/fcop/rules/_data/agent-bringup-prompt.en.md

Previous: MATCH; exact fact unchanged: true

[1588,1595) 新建文件（双语
[1612,1663) - `src/fcop/rules/_data/agent-bringup-prompt.zh.md`
[1615,1662) src/fcop/rules/_data/agent-bringup-prompt.zh.md
[1665,1716) - `src/fcop/rules/_data/agent-bringup-prompt.en.md`
[1668,1715) src/fcop/rules/_data/agent-bringup-prompt.en.md
[1588,1590) 新建

A p1:9e5f4ad1bc20c33e3be0256d UNRESOLVED PERMITTED 选

Previous: NEW; exact fact unchanged: false

[5706,5713) 资源注册可选）
[5711,5712) 选
[5706,5710) 资源注册

A p1:3aa3955c13be2f3136b00cd6 RESOLVED REQUIRED 到 笨模型

Previous: NEW; exact fact unchanged: false

[6859,6865) 到笨模型翻车
[6859,6860) 到
[6860,6863) 笨模型

A p1:c7b3fb883fe48448017d175a UNRESOLVED REQUIRED 避免

Previous: NEW; exact fact unchanged: false

[6991,7003) 避免 prompt 过期
[6991,6993) 避免

P p1:68619b121db2ce75a94dce49 RESOLVED ME [PERFORMER]

Previous: MATCH; exact fact unchanged: true

[88,101) recipient: ME
[99,101) ME

V p1:e07b37369e640be363ef1839 RESOLVED TASK-20260522-005

Previous: UNLISTED_SOURCE_SUPPORTED; exact fact unchanged: true

[210,237) related: [TASK-20260522-005
[220,237) TASK-20260522-005

V p1:7141db909f25ae6750f9fcd3 RESOLVED TASK-20260522-006

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[210,237) related: [TASK-20260522-005
[239,256) TASK-20260522-006

V p1:757eefa55c4234e2724731e4 RESOLVED TASK-20260522-006

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[259,288) supersedes: TASK-20260522-006
[271,288) TASK-20260522-006

V p1:95bf6f0f6479945f80fdceac RESOLVED fcop/tasks/TASK-20260522-006-ADMIN-to-ME.md

Previous: PARTIAL_SUPPORT; exact fact unchanged: true

[399,477) 本 task 修订自 TASK-20260522-006（详见 `fcop/tasks/TASK-20260522-006-ADMIN-to-ME.md`）
[432,475) fcop/tasks/TASK-20260522-006-ADMIN-to-ME.md

C p1:ae134af0398ef4accfbcb274 RESOLVED ## 验收标准 / Acceptance Criteria 

Previous: NEW; exact fact unchanged: false

[6163,6194) ## 验收标准 / Acceptance Criteria 
[6163,6192) ## 验收标准 / Acceptance Criteria
[6196,6197) 1
[6286,6287) 2
[6342,6343) 3
[6404,6405) 4
[6452,6453) 5
[6486,6487) 6
[6524,6525) 7
[6636,6637) 8
[6690,6691) 9
[6196,6283) 1. ✅ `src/fcop/rules/_data/agent-bringup-prompt.{zh,en}.md` 存在，六段齐全    （顶部场景表 + §1～§6）
[6286,6339) 2. ✅ §2 升级命令**不锁版本号**（只 `fcop fcop-mcp`，不写 `==X.Y.Z`）
[6342,6401) 3. ✅ §3 边界声明含 MCP 工具 vs Python API 对照表 + anti-pattern ≥ 6 条
[6404,6449) 4. ✅ §5 物理验证段列出五桶 + 必查清单，含 PowerShell `ls` 命令
[6452,6483) 5. ✅ §6 明确"P0 ≠ 0 必须停下报告 ADMIN"
[6486,6521) 6. ✅ README.md / README.zh.md 加入索引行
[6524,6633) 7. ✅ 跑一次 `python scripts/release_audit.py` 看是否触发文档相关 P0 / P1。    触发了就同步 `RULES-release-file-inventory.md` §2
[6636,6687) 8. ✅ 跑一次 `python scripts/inventory_drift.py` 三类警告清零
[6690,6735) 9. ✅ 写 REPORT-007，archive TASK-006 + TASK-007

B p1:de5930b2ca6af50fdfee5b5c RESOLVED FORBIDDEN 锁 版本号

Previous: NEW; exact fact unchanged: false

[502,532) **不锁版本号** — `pip install` 拉最新版
[505,506) 锁
[506,509) 版本号

B p1:56968a09f4e5ec284ebc28b3 RESOLVED FORBIDDEN 改 agent-install-prompt.zh.md` 现有内容

Previous: NEW; exact fact unchanged: false

[5925,5973) - 不改 `agent-install-prompt.zh.md` 现有内容（它管"装 mcp"
[5928,5929) 改
[5931,5963) agent-install-prompt.zh.md` 现有内容

B p1:02c04ba87baad41fa4de23da RESOLVED FORBIDDEN 动 LETTER-TO-ADMIN.md

Previous: NEW; exact fact unchanged: false

[5982,6023) - 不动 `LETTER-TO-ADMIN.md`（3.0.2 已经更新过摘要块）
[5988,6006) LETTER-TO-ADMIN.md
[5985,5986) 动

B p1:b483b56be146995579d25255 RESOLVED FORBIDDEN 做 工具层 anti-pattern 防呆

Previous: NEW; exact fact unchanged: false

[6026,6065) - 不做"工具层 anti-pattern 防呆"（v3.1.x 候选 ADR
[6029,6030) 做
[6031,6050) 工具层 anti-pattern 防呆

B p1:8180cf5a1aa80c16482074dd RESOLVED FORBIDDEN 发 新版本

Previous: NEW; exact fact unchanged: false

[6078,6105) - 不发新版本（攒到下次 patch / minor）
[6081,6082) 发
[6082,6085) 新版本

B p1:8d533472122497b1f4995201 RESOLVED FORBIDDEN 改 协议规则文件

Previous: NEW; exact fact unchanged: false

[6108,6158) - 不改协议规则文件（`fcop-rules.mdc` / `fcop-protocol.mdc`）
[6111,6112) 改
[6112,6118) 协议规则文件

B p1:c63902798c9b2482e573d853 RESOLVED FORBIDDEN 写 X.Y.Z

Previous: NEW; exact fact unchanged: false

[6326,6339) 不写 `==X.Y.Z`）
[6332,6337) X.Y.Z
[6327,6328) 写