export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const md = {
  code(s: string) {
    return '`' + s + '`';
  },
  escape(s: string) {
    return s.replace('.', '\\.').replace('=', '\\=');
  },
};
