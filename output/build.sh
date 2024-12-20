#!/bin/sh

# output 디렉토리 생성 (기존 디렉토리가 존재하면 삭제)
rm -rf output
mkdir output

# 현재 디렉토리의 내용을 output으로 복사
echo "Copying files from current directory to output directory..."
cp -R ./* ./output

# 결과 확인
echo "Output directory contents:"
ls -la ./output

echo "Build script completed successfully."