/**
 * Created by cpoopc on 2016/8/10.
 */
export default {
    /**
     * 移动数组中的元素位置 (用于拖拽排序)
     * 从from移动到to
     * @param arr 被移动的数组
     * @param from
     * @param to
     */
    moveElement(arr, from, to) {
        let target = arr[from]
        if (from > to) {
            for (let i = from; i > to; i--) {
                arr[i] = arr[i - 1]
            }
            arr[to] = target
        } else {
            for (let i = from; i < to; i++) {
                arr[i] = arr[i + 1]
            }
            arr[to] = target
        }
    },
    moveElementNew(array, from, to) {
        if(!array)return []
        let arr = array.concat()
        let target = arr[from]
        if (from > to) {
            for (let i = from; i > to; i--) {
                arr[i] = arr[i - 1]
            }
            arr[to] = target
        } else {
            for (let i = from; i < to; i++) {
                arr[i] = arr[i + 1]
            }
            arr[to] = target
        }
        return arr
    }
}
