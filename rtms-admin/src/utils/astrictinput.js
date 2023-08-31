// 限制输入特殊字符
// export function keyUp(e) {
//   e.target.value = e.target.value.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、"" /]/g, "");
// }
export function keyUp(e) {
  e.target.value = e.target.value.replace(/[`~!#$%^&@*()_\+=<>?:"{}|~！#￥%……&*（）={}|《》？：“”【】、；‘’，。、\s+]/g, '')
}

