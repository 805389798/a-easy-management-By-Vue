const msg = function msg(data) {
  if (data && data.code == 200) {
    this.$message({
      message: data.msg,
      type: 'success',
      duration: 1000,
    });
  } else {
    this.$message({
      message: data ? data.msg : '',
      type: 'error',
      duration: 1000,
    });
  }
};

export default msg;
