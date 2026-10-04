QA 读取 checksums.txt，核验 dist 目录中的全部压缩包，生成 package-check.md。任何一个校验值不匹配时，必须停止核验并向 PM 汇报。不得删除或重新生成压缩包。

**审阅重点：** ALL 输入、ANY 失败停止；禁止对象身份不丢。