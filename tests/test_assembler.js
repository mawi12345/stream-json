'use strict';

const unit = require('heya-unit');

const fs = require('fs'),
  path = require('path'),
  zlib = require('zlib');

const makeParser = require('../src/main');
const Assembler = require('../src/Assembler');

unit.add(module, [
  function test_assembler(t) {
    const async = t.startAsync('test_assembler');

    let object = null;
    const parser = makeParser(),
      assembler = Assembler.connect(parser);

    parser.on('end', () => {
      eval(t.TEST('t.unify(assembler.current, object)'));
      async.done();
    });

    fs.readFile(path.resolve(__dirname, './sample.json.gz'), (err, data) => {
      if (err) {
        throw err;
      }
      zlib.gunzip(data, (err, data) => {
        if (err) {
          throw err;
        }

        object = JSON.parse(data.toString());

        fs.createReadStream(path.resolve(__dirname, './sample.json.gz'))
          .pipe(zlib.createGunzip())
          .pipe(parser);
      });
    });
  },
  function test_assembler_no_streaming(t) {
    const async = t.startAsync('test_assembler_no_streaming');

    let object = null;
    const parser = makeParser({streamValues: false}),
      assembler = Assembler.connect(parser);

    parser.on('end', () => {
      eval(t.TEST('t.unify(assembler.current, object)'));
      async.done();
    });

    fs.readFile(path.resolve(__dirname, './sample.json.gz'), (err, data) => {
      if (err) {
        throw err;
      }
      zlib.gunzip(data, (err, data) => {
        if (err) {
          throw err;
        }

        object = JSON.parse(data.toString());

        fs.createReadStream(path.resolve(__dirname, './sample.json.gz'))
          .pipe(zlib.createGunzip())
          .pipe(parser);
      });
    });
  }
]);
