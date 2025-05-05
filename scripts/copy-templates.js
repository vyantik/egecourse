const fs = require('fs');
const path = require('path');
const { transformFileSync } = require('@swc/core');

const sourceDir = path.join(__dirname, '../src/libs/mail/templates');
const targetDir = path.join(__dirname, '../dist/libs/mail/templates');

// Создаем целевую директорию, если она не существует
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

// Компилируем и копируем файлы
fs.readdirSync(sourceDir).forEach(file => {
    if (file.endsWith('.tsx')) {
        const sourceFile = path.join(sourceDir, file);
        const targetFile = path.join(targetDir, file.replace('.tsx', '.js'));

        const { code } = transformFileSync(sourceFile, {
            jsc: {
                parser: {
                    syntax: 'typescript',
                    tsx: true,
                },
                transform: {
                    react: {
                        runtime: 'automatic',
                    },
                },
            },
            module: {
                type: 'commonjs',
            },
        });
        fs.writeFileSync(targetFile, code);
    } else {
        fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
    }
}); 