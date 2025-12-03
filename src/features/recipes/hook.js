/**
|--------------------------------------------------
| デバウンスフック（入力から少し待って値を反映させる仕組み）
|--------------------------------------------------
*/

import { useEffect, useState } from "react";
//関数の第二引数で、デフォルト値をいれる
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    //クリーンアップ関数
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
