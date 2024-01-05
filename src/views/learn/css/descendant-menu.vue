<!--
 * @Author: smq
 * @Date: 2023-11-10
 * @Description: 当一级与后面层级的颜色不一致时，区别一级与后面层级的颜色，重点是后面层级的css写法 是后代选择器
-->
<template>
  <!--
需求：当一级 与后面层级颜色不一致时，css写法：
1.一级：(.k-menu>ul>div>li>.el-menu-item .k-menu>ul>div>li>.el-submenu__title)
2.二级：(.k-menu>ul>div>li ul .el-menu-item  .k-menu>ul>div>li ul .el-submenu__title)
-->
  <div class="k-menu">
    <ul class="el-menu">
      <div class="menu-wrapper">
        <!--一层-->
        <li
          class="el-menu-item"
          style="padding-left: 20px"
        >
          一层
        </li>

        <!--  二层      -->
        <li class="el-submenu">
          <div class="el-submenu__title">
            共二层（现一层）
          </div>
          <ul class="el-menu">
            <li
              class="el-menu-item"
              style="padding-left:40px"
            >
              共二层（现二层）
            </li>
          </ul>
        </li>

        <!--  三层      -->
        <li class="el-submenu">
          <div class="el-submenu__title">
            共三层(现一层)
          </div>

          <ul class="el-menu">
            <li
              class="el-menu-item"
              style="padding-left: 40px"
            >
              共三层(现二层-01)
            </li>

            <div class="menu-wrapper">
              <li class="el-submenu">
                <div
                  class="el-submenu__title"
                  style="padding-left: 40px"
                >
                  共三层(现二层-02)
                </div>

                <ul class="el-menu">
                  <li
                    class="el-menu-item"
                    style="padding-left: 60px"
                  >
                    共三层(现三层)
                  </li>
                </ul>
              </li>
            </div>

            <li
              class="el-menu-item"
              style="padding-left: 40px"
            >
              共三层(现二层-03)
            </li>
          </ul>
        </li>

        <!--  四层      -->
        <li class="el-submenu">
          <div class="el-submenu__title">
            共三层(现一层)
          </div>

          <ul class="el-menu">
            <li
              class="el-menu-item"
              style="padding-left: 40px"
            >
              共四层(现二层-01)
            </li>

            <div class="menu-wrapper">
              <li class="el-submenu">
                <div
                  class="el-submenu__title"
                  style="padding-left: 40px"
                >
                  共四层(现二层-02)
                </div>

                <ul class="el-menu">
                  <div
                    class="el-submenu__title"
                    style="padding-left: 60px"
                  >
                    共四层(现三层-01)
                  </div>

                  <div class="menu-wrapper">
                    <li class="el-submenu">
                      <div
                        class="el-submenu__title"
                        style="padding-left: 60px"
                      >
                        共四层(现三层-02)
                      </div>

                      <ul class="el-menu">
                        <li
                          class="el-menu-item"
                          style="padding-left: 80px"
                        >
                          共四层(现四层)
                        </li>
                      </ul>
                    </li>
                  </div>
                </ul>
              </li>
            </div>

            <li
              class="el-menu-item"
              style="padding-left: 40px"
            >
              共四层(现二层-03)
            </li>
          </ul>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
export default {}

</script>
<style lang='scss'>
/*一级   无子级 ， 有子级*/
.k-menu>.el-menu>.menu-wrapper>.el-menu-item, .k-menu>.el-menu>.menu-wrapper>.el-submenu>.el-submenu__title{
  color: red;
}
/*二级的一级 或 三级 ...多级      无子级 ， 有子级*/
.k-menu>.el-menu>.menu-wrapper>.el-submenu .el-menu .el-menu-item, .k-menu>.el-menu>.menu-wrapper>.el-submenu .el-menu .el-submenu__title{
  color: blue;
}
</style>
