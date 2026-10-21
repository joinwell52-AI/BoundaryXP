import {stable} from '../../../src/bxp/ir-kernel/values.mjs';

// 仅允许已经逐文件核对的展示升级保持原比较状态。
// 两端完整安装摘要必须精确匹配；未来任意后端变化仍会失效。
// 历史记录及所有语义字段保持不变；resourceGuard 仍校验全部文件。
export function sameComparisonResources(saved, current, presentationCompatibility = null) {
  if (!saved || !current) return false;
  if (stable(saved) === stable(current)) return true;
  const pairs=Array.isArray(presentationCompatibility)?presentationCompatibility:[presentationCompatibility];
  if (!pairs.some(pair=>pair&&saved.runtime===pair.from_runtime&&current.runtime===pair.to_runtime)) return false;
  const {runtime: savedInstallation, ...savedSemantic} = saved;
  const {runtime: currentInstallation, ...currentSemantic} = current;
  return stable(savedSemantic) === stable(currentSemantic);
}
