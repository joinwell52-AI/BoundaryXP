; 
(set-info :status unknown)
(declare-fun a0 () Bool)
(declare-fun v1bedc7247f79430f15d6f7d9 () Real)
(declare-fun v29be75688f72874de35ab518 () Real)
(declare-fun a1 () Bool)
(declare-fun v98497627b17123a50f1f3933 () Real)
(declare-fun vc847c3768d13537fcff9870f () Real)
(declare-fun a2 () Bool)
(declare-fun v1ad561034a096e70d2a68682 () Real)
(declare-fun vfe56813bb3a89811d6977bdf () Real)
(declare-fun a3 () Bool)
(declare-fun v9bfc4689b7b5ef54e3a5b1c1 () Real)
(declare-fun v7aa21ea06c050f73b4ed69da () Real)
(declare-fun a4 () Bool)
(declare-fun a5 () Bool)
(declare-fun a6 () Bool)
(declare-fun a7 () Bool)
(declare-fun a8 () Bool)
(declare-fun a9 () Bool)
(assert
 (=> a0 true))
(assert
 (let (($x32 (<= v29be75688f72874de35ab518 v1bedc7247f79430f15d6f7d9)))
 (=> a1 $x32)))
(assert
 (let (($x42 (<= vc847c3768d13537fcff9870f v98497627b17123a50f1f3933)))
 (=> a2 $x42)))
(assert
 (let (($x50 (<= vfe56813bb3a89811d6977bdf v1ad561034a096e70d2a68682)))
 (=> a3 $x50)))
(assert
 (let (($x58 (<= v7aa21ea06c050f73b4ed69da v9bfc4689b7b5ef54e3a5b1c1)))
 (=> a4 $x58)))
(assert
 (let (($x32 (<= v29be75688f72874de35ab518 v1bedc7247f79430f15d6f7d9)))
 (=> a5 $x32)))
(assert
 (let (($x42 (<= vc847c3768d13537fcff9870f v98497627b17123a50f1f3933)))
 (=> a6 $x42)))
(assert
 (let (($x50 (<= vfe56813bb3a89811d6977bdf v1ad561034a096e70d2a68682)))
 (=> a7 $x50)))
(assert
 (let (($x58 (<= v7aa21ea06c050f73b4ed69da v9bfc4689b7b5ef54e3a5b1c1)))
 (=> a8 $x58)))
(assert
 (let ((?x84 (ite true 1 0)))
(let ((?x85 (+ ?x84 ?x84)))
(let ((?x86 (+ ?x85 ?x84)))
(let ((?x87 (+ ?x86 ?x84)))
(let (($x89 (<= ?x87 3)))
(let (($x90 (not $x89)))
(=> a9 $x90))))))))
(check-sat-assuming (a0 a1 a2 a3 a4 a5 a6 a7 a8 a9))
