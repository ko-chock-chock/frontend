#!/bin/sh

# 기존 output 및 public 디렉토리 삭제 (있을 경우)
rm -rf output
rm -rf public

# output 디렉토리 생성
mkdir output

# 현재 디렉토리의 내용을 output 디렉토리로 복사
echo "Copying files from current directory to output directory..."
cp -R ./* ./output

# output 내용을 public 디렉토리로 이동 (Vercel 요구사항)
echo "Moving output directory contents to public directory..."
mkdir public
mv ./output/* ./public

# 결과 확인
echo "Public directory contents:"
ls -la ./public

echo "Build script completed successfully."
