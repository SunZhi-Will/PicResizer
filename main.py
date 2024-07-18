from PIL import Image
import os

# 定義輸入與輸出資料夾
input_folder = 'import_images'
output_folder = 'save_images'

# 確保輸出資料夾存在
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# 遍歷輸入資料夾中的所有 JFIF 文件
for filename in os.listdir(input_folder):
    if filename.lower().endswith('.jfif'):
        # 打開 JFIF 文件
        with Image.open(os.path.join(input_folder, filename)) as img:
            # 將圖片大小調整為 2560x2560
            img = img.resize((2560, 2560))
            # 保存為 PNG 文件
            new_filename = os.path.splitext(filename)[0] + '.png'
            img.save(os.path.join(output_folder, new_filename))

print("所有圖片已成功轉換並調整大小。")
