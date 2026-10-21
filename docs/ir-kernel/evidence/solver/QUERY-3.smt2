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
(assert
 (let ((?x13 (ite true 1 0)))
 (let ((?x14 (+ ?x13 ?x13)))
 (let ((?x15 (+ ?x14 ?x13)))
 (let (($x17 (<= ?x15 3)))
 (=> a0 $x17))))))
(assert
 (=> a1 true))
(assert
 (let (($x40 (<= v29be75688f72874de35ab518 v1bedc7247f79430f15d6f7d9)))
 (=> a2 $x40)))
(assert
 (let (($x50 (<= vc847c3768d13537fcff9870f v98497627b17123a50f1f3933)))
 (=> a3 $x50)))
(assert
 (let (($x58 (<= vfe56813bb3a89811d6977bdf v1ad561034a096e70d2a68682)))
(=> a4 $x58)))
(check-sat-assuming (a0 a1 a2 a3 a4))
