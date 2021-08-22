/**
 * @param {string} target 待校验路径
 * @param {RegExp | RegExp[]} rules 待校验规则, 支持正则或正则数组
 * @returns 
 */
 function pathRulesTest(target, rules) {
  // TODO 支持 /pages/**/*.vue格式的字符串
  if (rules instanceof RegExp) {
    return rules.test(target)
  }

  if (Array.isArray(rules)) {
    return !!rules.find(rule => pathRulesTest(targe, rule))
  }

  return false
}

module.exports = {
  pathRulesTest
}