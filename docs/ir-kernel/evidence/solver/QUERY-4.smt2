; 
(set-info :status unknown)
(declare-fun a0 () Bool)
(declare-fun a1 () Bool)
(declare-fun v1bedc7247f79430f15d6f7d9 () Real)
(declare-fun v29be75688f72874de35ab518 () Real)
(declare-fun a2 () Bool)
(declare-fun v98497627b17123a50f1f3933 () Real)
(declare-fun vc847c3768d13537fcff9870f () Real)
(declare-fun a3 () Bool)
(declare-fun v1ad561034a096e70d2a68682 () Real)
(declare-fun vfe56813bb3a89811d6977bdf () Real)
(declare-fun a4 () Bool)
(declare-fun v9bfc4689b7b5ef54e3a5b1c1 () Real)
(declare-fun v7aa21ea06c050f73b4ed69da () Real)
(declare-fun a5 () Bool)
(assert
 (let ((?x15 (ite true 1 0)))
 (let ((?x16 (+ ?x15 ?x15)))
 (let ((?x17 (+ ?x16 ?x15)))
 (let ((?x18 (+ ?x17 ?x15)))
 (let (($x20 (<= ?x18 3)))
 (=> a0 $x20)))))))
(assert
 (=> a1 true))
(assert
 (let (($x45 (<= v29be75688f72874de35ab518 v1bedc7247f79430f15d6f7d9)))
 (=> a2 $x45)))
(assert
 (let (($x55 (<= vc847c3768d13537fcff9870f v98497627b17123a50f1f3933)))
 (=> a3 $x55)))
(assert
 (let (($x63 (<= vfe56813bb3a89811d6977bdf v1ad561034a096e70d2a68682)))
 (=> a4 $x63)))
(assert
 (let (($x71 (<= v7aa21ea06c050f73b4ed69da v9bfc4689b7b5ef54e3a5b1c1)))
(=> a5 $x71)))
(check-sat-assuming (a0 a1 a2 a3 a4 a5))
