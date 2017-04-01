
class UploadCtrl {

  constructor (opt) {
    this.dom = document.getElementById(opt.id)
    this.preview = opt.pid && document.getElementById(opt.pid)
    this.previewfn = opt.previewfn
    this.fileFilter = ''
    this.url = opt.url
    this.fileObject = opt.fileObject
    this.uploadReady = opt.uploadReady
    var self = this
    this.dom.addEventListener('change', (e) => {
      self.onchange(e)
    }, false)
    this.autoUpload = opt.autoUpload || false
    this.onSuccess = opt.onSuccess
    this.showTip = opt.showTip
    this.onFailure = opt.onFailure
    this.fileType = opt.fileType || '*'
    this.maxSize = opt.maxSize || 4096000
    this.outSize = '大小不能超出' + (this.maxSize / 1024000) + 'MB'
  }

  onchange (e) {
    var files = e.target.files || e.dataTransfer.files
    this.fileFilter = this.filter(files)
    if (this.fileFilter === '') return
    // if (this.preview) {
    //   this.showPerview()
    // }
    this.autoUpload && this.uploadFile()
    return this
  }

  filter (files) {
    var file = files[0]
    if (this.fileType !== '*') {
      var type = this.getFileType(file)
      if (!this.allowType(type)) {
        this.showTip('只允许上传:' + this.fileType.toString() + ' 格式的文件')
        return ''
      }
    }
    if (file.size >= this.maxSize) {
      this.showTip('文件"' + file.name + '"' + this.outSize)
      return ''
    } else {
      return file
    }
  }

  getFileType (file) {
    var type
    var arr
    if (file.type) {
      arr = file.type.split('/')
      if (arr.length > 1) type = arr[1]
    } else if (file.name) {
      arr = file.name.split('.')
      var len = arr.length
      type = arr[len - 1]
    }
    file.fileType = type
    return type
  }

  allowType (type) { // 是否是允许的上传格式
    if (this.fileType !== '*') {
      for (var i = 0, j = this.fileType.length; i < j; i++) {
        if (type === 'jpeg') {
          if (type === this.fileType[i] || this.fileType[i] === 'jpg') return true
        } else if (type === this.fileType[i]) return true
      }
      return false
    }
    return true
  }

  showPerview () {
    var reader = new window['FileReader']()
    var self = this
    var file = this.fileFilter
    reader.onload = (e) => {
      self.previewfn && self.previewfn(e.target.result)
      // self.preview.src = e.target.result
    }
    reader.readAsDataURL(file)
  }

  uploadFile () {
    this.uploadReady && this.uploadReady()
    var self = this
    this.previewfn && this.previewfn('');
    (function (file) {
      var xhr = new window['XMLHttpRequest']()
      if (xhr.upload) {
        xhr.upload.addEventListener('progress', (e) => {
          self.onProgress(file, e.loaded, e.total)
        }, false)

        xhr.onreadystatechange = (e) => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              var result = window['JSON'].parse(xhr.responseText)
              if (result.errno === 0) {
                if (self.preview) {
                  self.showPerview()
                }
                self.onSuccess(file, result.rsm)
              } else {
                self.dom.value = ''
                self.showTip(result.msg || result.err)
              }
              if (self.fileFilter === '') {
                self.onComplete()
              }
              self.fileFilter = ''
            } else {
              self.onFailure(file, xhr.responseText)
            }
          }
        }
        var fd = new window['FormData']()
        xhr.open('POST', self.url + '&_post_type=ajax', true)
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpHequest')
        xhr.setRequestHeader('content-length', file.size)
        // xhr.setRequestHeader('Content-Type', 'text/xml; charset=utf-8')
        fd.append(self.fileObject || 'Filedata', file)
        self.beforeUpload && self.beforeUpload(fd)
        xhr.send(fd)
      }
    })(this.fileFilter)
  }

  showTip () {

  }

  onProgress () {

  }

  onFailure () {

  }

  onSuccess () {

  }

  onComplete () {

  }

}

export default UploadCtrl
