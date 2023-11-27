<template>
  <el-menu
    :router="true"
    :default-active="
      ($route.matched[0] && $route.matched[0].path == '/') ||
      $route.path == '/home'
        ? '/'
        : $route.path
    "
  >
    <h3>Vue Tracker</h3>

    <el-menu-item index="/">
      <el-icon>
        <timer />
      </el-icon>
      <span>Tracker</span>
    </el-menu-item>

    <el-menu-item index="2" disabled>
      <el-icon>
        <folder />
      </el-icon>
      <span>Catégories</span>
    </el-menu-item>

    <el-sub-menu index="/settings">
      <template #title>
        <el-icon>
          <setting />
        </el-icon>
        <span>Paramètres</span>
      </template>
      <el-menu-item index="/settings/app">Application</el-menu-item>
      <el-menu-item index="/settings/user">Utilisateur</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
export default {};
</script>

<style scoped>
.el-menu {
  border-right: none !important;
  text-align: left;
}

h3 {
  text-align: center;
}
</style>
