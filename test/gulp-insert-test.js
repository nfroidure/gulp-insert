var insert = require('../'),
    expect = require('chai').expect,
    File = require('gulp-util').File
    Stream = require('readable-stream');

// Helper
function getStreamFromBuffer(string) {
  var stream = new Stream.Readable();
  stream._read = function() {
    stream.push(new Buffer(string));
    stream._read = stream.push.bind(stream, null);
  };
  return stream;
}

describe('Append', function() {
  it('let pass null files through', function(done) {
    var stream = insert.append(' world');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: null
    });

    stream.on('data', function(file) {
      expect(file.contents).to.be.equal(null);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('appends the string onto the file in buffer mode', function(done) {
    var stream = insert.append(' world');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: new Buffer('Hello')
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.be.equal('Hello world');
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('appends the string onto the file in stream mode', function(done) {
    var stream = insert.append(' world');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: getStreamFromBuffer(new Buffer('Hello'))
    });

    stream.on('data', function(file) {
      var buffers = [];
      file.contents.on('data', function(buf) {
        buffers.push(buf);
      });
      file.contents.on('end', function() {
        expect(Buffer.concat(buffers).toString()).to.be.equal('Hello world');
        done();
      });
    });

    stream.write(fakeFile);
    stream.end();
  });

});

describe('Prepend', function() {
  it('let pass null files through', function(done) {
    var stream = insert.prepend('Hello');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: null
    });

    stream.on('data', function(file) {
      expect(file.contents).to.be.equal(null);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('prepends the string onto the file in buffer mode', function(done) {
    var stream = insert.prepend('Hello');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: new Buffer(' world')
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.be.equal('Hello world');
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('prepends the string onto the file in stream mode', function(done) {
    var stream = insert.prepend('Hello');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: getStreamFromBuffer(new Buffer(' world'))
    });

    stream.on('data', function(file) {
      var buffers = [];
      file.contents.on('data', function(buf) {
        buffers.push(buf);
      });
      file.contents.on('end', function() {
        expect(Buffer.concat(buffers).toString()).to.be.equal('Hello world');
        done();
      });
    });

    stream.write(fakeFile);
    stream.end();
  });
});

describe('Wrap', function() {
  it('let pass null files through', function(done) {
    var stream = insert.wrap('Hello ', '!');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: null
    });

    stream.on('data', function(file) {
      expect(file.contents).to.be.equal(null);
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('prepends the first argument and appends the second argument in buffer mode', function(done) {
    var stream = insert.wrap('Hello ', '!');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: new Buffer('world')
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.be.equal('Hello world!');
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('prepends the first argument and appends the second argument in stream mode', function(done) {
    var stream = insert.wrap('Hello ', '!');

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: getStreamFromBuffer(new Buffer('world'))
    });

    stream.on('data', function(file) {
      var buffers = [];
      file.contents.on('data', function(buf) {
        buffers.push(buf);
      });
      file.contents.on('end', function() {
        expect(Buffer.concat(buffers).toString()).to.be.equal('Hello world!');
        done();
      });
    });

    stream.write(fakeFile);
    stream.end();
  });
});

describe('Transform', function() {
  it('let pass null files through', function(done) {
    var stream = insert.transform(function(data) {
      return data.toUpperCase();
    });

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: null
    });

    stream.on('data', function(file) {
      expect(file.contents).to.be.equal(null);
      done();
    });

    stream.write(fakeFile);
    stream.end();

  });

  it('applys the function to the string in buffer mode', function(done) {
    var stream = insert.transform(function(data) {
      return data.toUpperCase();
    });

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: new Buffer('hello world')
    });

    stream.on('data', function(file) {
      expect(file.contents.toString()).to.be.equal('HELLO WORLD');
      done();
    });

    stream.write(fakeFile);
    stream.end();

  });

  it('applys the function to the string in stream mode', function(done) {
    var stream = insert.transform(function(data) {
      return data.toUpperCase();
    });

    var fakeFile = new File({
      cwd: __dirname,
      base: __dirname + 'test',
      path: __dirname + 'test/file.js',
      contents: getStreamFromBuffer(new Buffer('hello world'))
    });

    stream.on('data', function(file) {
      var buffers = [];
      file.contents.on('data', function(buf) {
        buffers.push(buf);
      });
      file.contents.on('end', function() {
        expect(Buffer.concat(buffers).toString()).to.be.equal('HELLO WORLD');
        done();
      });
    });

    stream.write(fakeFile);
    stream.end();
  });
});
