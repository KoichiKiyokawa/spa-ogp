import "zx/globals";

const pruneDeps = async () => {
  await $`rm -rf node_modules`;
  await $`pnpm i --prod`;
};

await Promise.all([
  within(async () => {
    cd("../lambda/viewer-request");
    await pruneDeps();
  }),
  within(async () => {
    cd("../lambda/origin-request");
    await pruneDeps();
  }),
]);
