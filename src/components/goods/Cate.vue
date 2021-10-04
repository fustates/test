<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true"
        index-text="#" border :show-row-hover="false" class="tree-table">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false " style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 这是排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <!-- 这是操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDiaog(scope.row.cat_id)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.cat_id)">删除
          </el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="提示" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClose">
      <!-- 添加分类表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- option用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
            @change="parentCateChanged" clearable>
          </el-cascader>

        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="roleName">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ediUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        //   查询条件
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        //   商品分类的数据列表,默认为空
        catelist: [],
        total: 0,
        // 为table指定列表定义
        columns: [{
          label: '分类名称',
          prop: 'cat_name',
        }, {
          label: '是否有效',
          //   表示，将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用的模板名称
          template: 'isok',
        }, {
          label: '排序',
          //   表示，将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用的模板名称
          template: 'order',
        }, {
          label: '操作',
          //   表示，将当前列定义为模板列
          type: 'template',
          //   表示当前这一列使用的模板名称
          template: 'opt',
        }, ],
        // 控制添加分类对话框的显示与隐藏
        addCateDialogVisible: false,
        // 添加分类的表单对象
        addCateForm: {
          // 将要添加的分类名称
          cat_name: '',
          //   父级分类id
          cat_pid: 0,
          //   分类的等级，默认要添加的是一级分类
          cat_level: 0
        },
        // 添加分类表单的验证规则对象
        addCateFormRules: {
          cat_name: [{
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }]
        },
        // 父级分类的列表
        parentCateList: [],
        // 指定级联选择器的配置对象
        cascaderProps: {
          expandTrigger: 'hover',
          checkStrictly: true,
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 选中的父级分类的id数组
        selectedKeys: [],
        // 控制编辑商品对话框的显示与隐藏
        editDialogVisible: false,
        // 查询到的商品信息对象
        editForm: {},
        // 添加表单的角色规则对象 and 修改表单的角色规则对象
        addFormRules: {
          cat_name: [{
            required: true,
            message: "请输入商品名",
            trigger: "blur"
          }, {
            min: 1,
            max: 7,
            message: "角色名称的长度在1~7个字符之间",
            trigger: "blur"
          }]
        },
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      // 获取商品分类数据
      async getCateList() {
        const {
          data: res
        } = await this.$http.get('categories', {
          params: this.queryInfo
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品失败！')
        }
        console.log(res.data);
        // 把数据列表复制给result
        this.catelist = res.data.result
        // 为总数据条数赋值
        this.total = res.data.total
      },
      //   监听pagesize改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      //   监听pagenum改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      //   点击按钮，显示添加分类的对话框
      showAddCateDialog() {
        //   先获取父级分类的数据列表
        this.getParentCateList()
        // 再展示出对话框
        this.addCateDialogVisible = true
      },
      // 获取父级分类的数据列表
      async getParentCateList() {
        const {
          data: res
        } = await this.$http.get('categories', {
          params: {
            type: 2
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取父级分类的数据失败！')
        }
        this.parentCateList = res.data
        console.log(this.parentCateList);
      },
      //   选择项发生改变触发这个函数
      parentCateChanged() {
        console.log(this.selectedKeys);
        // 如果selectedKeys数组中的length 大于0，证明选中的父级分类
        // 反之，就说明没有选中任何父级分类
        if (this.selectedKeys.length > 0) {
          // 父级分类id
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
          // 为当前分类的等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length
          return
        } else {
          // 父级分类id
          this.addCateForm.cat_pid = 0
          // 为当前分类的等级赋值
          this.addCateForm.cat_level = 0
        }
      },
      //   点击按钮添加新分类
      addCate() {
        this.$refs.addCateFormRef.validate(async valid => {
          if (!valid) return
          const {
            data: res
          } = await this.$http.post('categories', this.addCateForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加分类失败！')
          }
          this.$message.success('添加分类成功！')
          this.getCateList()
          this.addCateDialogVisible = false
        })
        console.log(this.addCateForm);
      },
      //   监听对话框的关闭事件。重置表单数据
      addCateDialogClose() {
        this.$refs.addCateFormRef.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_level = 0
        this.addCateForm.cat_pid = 0
      },
      // 展示编辑角色的对话框
      async showEditDiaog(id) {
        const {
          data: res
        } = await this.$http.get("categories/" + id);
        if (res.meta.status !== 200) {
          return this.$message.error("查询角色失败！");
        }
        this.editForm = res.data;
        this.editDialogVisible = true;
      },
      //   监听编辑商品对话框的关闭事件
      editDialogClosed() {
        this.$refs.editFormRef.resetFields();
      },
      //   修改商品信息并提交
      ediUserInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          //   可以发出添加商品的网络请求
          const {
            data: res
          } = await this.$http.put(
            "categories/" + this.editForm.cat_id, {
              cat_name: this.editForm.cat_name,
            }
          );
          if (res.meta.status !== 200) {
            this.$message.error("更新角色信息失败！");
          }
          //   提示修改成功
          this.$message.success("更新角色信息成功！");
          //   隐藏添加对话框
          this.editDialogVisible = false;
          //   重新获取角色列表数据
          this.getCateList();
        });
      },
      //   根据id删除对应的角色信息
      async removeUserById(id) {
        //   弹窗询问角色是否删除数据
        const confirmResult = await this.$confirm(
          "此操作将永久删除该角色, 是否继续?",
          "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).catch(err => err);
        //如果角色确认删除，则返回值为字符串 confirm
        //如果角色取消删除，则返回值为字符串 cancel
        // console.log(confirmResult);
        if (confirmResult !== "confirm") {
          return this.$message.info("已取消删除");
        }
        const {
          data: res
        } = await this.$http.delete("categories/" + id);
        if (res.meta.status !== 200) {
          return this.$message.error("删除角色失败！");
        }
        this.$message.success("删除角色成功！");
        this.getCateList();
      },
    }
  }

</script>

<style lang="less" scoped>
  .tree-table {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }

</style>
