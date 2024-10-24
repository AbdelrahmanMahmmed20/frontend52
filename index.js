const express = require('express');
const xlsx = require('xlsx');
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const readExcel = () => {
  const workbook = xlsx.readFile('students.xlsx'); // اسم ملف الاكسيل
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

const writeExcel = (students) => {
  const newWorkbook = xlsx.utils.book_new();
  const newSheet = xlsx.utils.json_to_sheet(students);
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, 'Sheet1');
  xlsx.writeFile(newWorkbook, 'students.xlsx');
};

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Tadaima</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; direction: rtl; }
          .container { background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); width: 300px; text-align: center; }
          h1 { margin-bottom: 20px; color: #333; }
          input[type="text"] { width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 5px; text-align: right; }
          button { padding: 10px 15px; border: none; border-radius: 5px; background-color: #4CAF50; color: white; cursor: pointer; transition: background-color 0.3s; }
          button:hover { background-color: #45a049; }
          .styled-paragraph { font-size: 11px; line-height: 1.6; color: #333; text-align: justify; background-color: #B9FBC0; border-left: 5px solid #4CAF50; padding: 10px 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>إدخال كود المتدرب</h1>
          <form action="/student" method="post">
            <input type="text" name="code" placeholder="أدخل الكود " required>
            <button type="submit">ارســال</button>
            <p class ="styled-paragraph">هذا البرنامج تم تطويره بواسطة م/ عبدالرحمن، عضو فريق Tadaima</p>
          </form>
        </div>
      </body>
    </html>
  `);
});

// معالجة البيانات المدخلة من المستخدم
app.post('/student', (req, res) => {
  const code = req.body.code;
  const students = readExcel();
  const student = students.find(s => s.Code == code);

  if (student) {
    const testLinkOne = '/test/' + student.Code; // تحديث الرابط
    const sessionOne = 'https://drive.google.com/file/d/1Z30Qn2d4FqMV7DmjZ77oJNJ7FbgngFw8/view?usp=sharing';
    const sessionTwo = 'https://drive.google.com/drive/folders/1OvE_1aICxH3Rnganaw2tfE0ieftvL93t?usp=drive_link';

    // نص الاختبار بناءً على قيمة Grade1
    let testStatus;
    if (student.Grade1 > 1) {
      testStatus = 'تم الدخول إلى الاختبار مسبقًا'; // نص عادي إذا كانت Grade1 أكبر من 0
    } else {
      testStatus = `<a href="${testLinkOne}">الذهاب الي الاختبار</a>`; // رابط إذا كانت Grade1 تساوي 0
    }

    res.send(`
    <html>
      <head>
        <title>Tadaima</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; direction: rtl; }
          .container { background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); width: 90%; max-width: 400px; text-align: center; }
          h2 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
          th { background-color: #4CAF50; color: white; }
          a { display: inline-block; margin-top: 10px; color: #4CAF50; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>بيانات المتدرب: ${student.Name}</h2>
          <h4>الكود: ${student.Code}</h4>
          <table>
            <tr>
              <th>العنصر</th>
              <th>المحتوي</th>
            </tr>
            <tr>
              <td><strong>الاختبار الأول:</strong></td>
              <td>${testStatus}</td> <!-- تم استخدام testStatus هنا -->
            </tr>
            <tr>
              <td><strong>نتيجة الاختبار الاول:</strong></td>
              <td>15 / ${student.Grade1}</td>
            </tr>
            <tr>
              <td><strong> أول سيشن:</strong></td>
              <td><a href="${sessionOne}" target="_blank">اضغط هنا</a></td>
            </tr>
            <tr>
              <td><strong> ثاني سيشن:</strong></td>
              <td><a href="${sessionTwo}" target="_blank">اضغط هنا</a></td>
            </tr>
          </table>
          <a href="/">رجوع</a>
        </div>
      </body>
    </html>
    `);
  } else {
    res.send(`
      <html>
        <head>
          <title>خطأ</title>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f0f0f0; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; direction: rtl; }
            .container { background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); width: 300px; text-align: center; }
            h1 { color: #ff0000; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>خطأ</h1>
            <p>لا يوجد بيانات لهذا المتدرب</p>
            <a href="/">رجوع</a>
          </div>
        </body>
      </html>
    `);
  }
});


// صفحة الاختبار
app.get('/test/:code', (req, res) => {
  const code = req.params.code;
  res.send(`
<html>
  <head>
    <title>اختبار المتدرب</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        background-color: #f0f0f0; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        margin: 0; 
        direction: rtl; /* إضافة اتجاه RTL */
      }
      .container { 
        background-color: #ffffff; 
        padding: 20px; 
        border-radius: 10px; 
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
        width: 90%; 
        max-width: 500px; 
        text-align: right; /* محاذاة النص إلى اليمين */
        overflow-y: auto; /* إضافة خاصية التمرير العمودي */
        max-height: 60vh;
      }
      h1 { 
        color: #4CAF50; 
        margin-bottom: 20px; 
      }
      h3 { 
        color: #333; 
        margin: 15px 0; 
      }
      label { 
        display: block; 
        margin: 10px 0; 
        font-size: 16px; 
        text-align: right; /* محاذاة النص إلى اليمين */
      }
      select { 
        width: 100%; 
        padding: 10px; 
        border: 1px solid #ddd; 
        border-radius: 5px; 
        margin-bottom: 20px; 
        text-align: right; /* محاذاة النص في القائمة المنسدلة */
      }
      button { 
        padding: 10px 15px; 
        border: none; 
        border-radius: 5px; 
        background-color: #4CAF50; 
        color: white; 
        cursor: pointer; 
        transition: background-color 0.3s; 
        font-size: 16px; 
      }
      button:hover { 
        background-color: #45a049; 
      }
      .footer { 
        margin-top: 20px; 
        font-size: 14px; 
        color: #777; 
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>اختبار المتدرب</h1>
      <form action="/submit-test" method="post">
        <input type="hidden" name="code" value="${code}">
        
<h3>السؤال 1: ما نوع البيانات الذي يستخدم لتخزين عدد صحيح؟</h3>
<label for="answer1">اختر الإجابة:</label>
<select name="answer1" id="answer1" required>
  <option value="">اختر الإجابة</option>
  <option value="1">float</option>
  <option value="2">int</option>
  <option value="3">char</option>
  <option value="4">double</option>
</select>

<h3>السؤال 2: ما نوع البيانات الذي يستخدم لتخزين حرف واحد؟</h3>
<label for="answer2">اختر الإجابة:</label>
<select name="answer" id="answer2" required>
  <option value=""2>اختر الإجابة</option>
  <option value="1">int</option>
  <option value="2">float</option>
  <option value="3">char</option>
  <option value="4">double</option>
</select>

<h3>السؤال 3: ما نوع البيانات المناسب لتخزين رقم عشري؟</h3>
<label for="answer3">اختر الإجابة:</label>
<select name="answer3" id="answer3" required>
  <option value="">اختر الإجابة</option>
  <option value="1">int</option>
  <option value="2">float</option>
  <option value="3">char</option>
  <option value="4">bool</option>
</select>

<h3>السؤال 4: ما نوع البيانات الذي يمثل القيم الصحيحة والخاطئة؟</h3>
<label for="answer4">اختر الإجابة:</label>
<select name="answer4" id="answer4" required>
  <option value="">اختر الإجابة</option>
  <option value="1">int</option>
  <option value="2">bool</option>
  <option value="3">double</option>
  <option value="4">char</option>
</select>

<h3>السؤال 5: ما نوع البيانات الذي يمثل عددًا عشريًا بدقة أكبر من float؟</h3>
<label for="answer5">اختر الإجابة:</label>
<select name="answer5" id="answer5" required>
  <option value="">اختر الإجابة</option>
  <option value="1">int</option>
  <option value="2">char</option>
  <option value="3">double</option>
  <option value="4">bool</option>
</select>

<h3>السؤال 6: أي نوع من البيانات يستخدم لتخزين النصوص في C++؟</h3>
<label for="answer6">اختر الإجابة:</label>
<select name="answer6" id="answer6" required>
  <option value="">اختر الإجابة</option>
  <option value="1">int</option>
  <option value="2">string</option>
  <option value="3">char</option>
  <option value="4">float</option>
</select>

<h3>السؤال 7: ما هو الإخراج الصحيح للأمر التالي؟</h3>
<label for="answer7">اختر الإجابة:</label>
<select name="answer7" id="answer7" required>
  <option value="">اختر الإجابة</option>
  <option value="1">طباعة "Hello, World!" على الشاشة</option>
  <option value="2">طباعة "Hello World" على الشاشة</option>
  <option value="3">طباعة "World, Hello!" على الشاشة</option>
  <option value="4">خطأ في الكود</option>
</select>

<h3>السؤال 8: أي من الخيارات التالية يستخدم لإدخال البيانات في C++؟</h3>
<label for="answer8">اختر الإجابة:</label>
<select name="answer8" id="answer8" required>
  <option value="">اختر الإجابة</option>
  <option value="1">cout</option>
  <option value="2">cin</option>
  <option value="3">scanf</option>
  <option value="4">printf</option>
</select>

<h3>السؤال 9: ما هي الوظيفة الأساسية للأمر cin؟</h3>
<label for="answer9">اختر الإجابة:</label>
<select name="answer9" id="answer9" required>
  <option value="">اختر الإجابة</option>
  <option value="1">طباعة النص</option>
  <option value="2">إدخال البيانات من المستخدم</option>
  <option value="3">تهيئة المتغيرات</option>
  <option value="4">تحميل مكتبة</option>
</select>

<h3>السؤال 10: ماذا يعني الرمز << في C++؟</h3>
<label for="answer10">اختر الإجابة:</label>
<select name="answer10" id="answer10" required>
  <option value="">اختر الإجابة</option>
  <option value="1">إدخال البيانات</option>
  <option value="2">مقارنة قيمتين</option>
  <option value="3">طباعة البيانات</option>
  <option value="4">التعامل مع النصوص</option>
</select>

<h3>السؤال 11: أي نوع من البيانات يتم استخدامه لتخزين القيم الحقيقية مثل 3.14159؟</h3>
<label for="answer11">اختر الإجابة:</label>
<select name="answer11" id="answer11" required>
  <option value="">اختر الإجابة</option>
  <option value="1">int</option>
  <option value="2">double</option>
  <option value="3">char</option>
  <option value="4">bool</option>
</select>

<h3>السؤال 12: أي من التالي يمثل رمز الإخراج في C++؟</h3>
<label for="answer12">اختر الإجابة:</label>
<select name="answer12" id="answer12" required>
  <option value="">اختر الإجابة</option>
  <option value="1">>></option>
  <option value="2"><<</option>
  <option value="3">==</option>
  <option value="4">=</option>
</select>

<h3>السؤال 13: ما نوع البيانات المناسب لتخزين الأعداد السالبة والموجبة؟</h3>
<label for="answer13">اختر الإجابة:</label>
<select name="answer13" id="answer13" required>
  <option value="">اختر الإجابة</option>
  <option value="1">unsigned int</option>
  <option value="2">int</option>
  <option value="3">char</option>
  <option value="4">bool</option>
</select>

<h3>السؤال 14: ماذا يحدث عند استخدام cin بدون متغير للتخزين؟</h3>
<label for="answer14">اختر الإجابة:</label>
<select name="answer14" id="answer14" required>
  <option value="">اختر الإجابة</option>
  <option value="1">يتم إظهار خطأ في الكود</option>
  <option value="2">يتم حفظ البيانات في المتغير الافتراضي</option>
  <option value="3">لا يحدث شيء</option>
  <option value="4">يتم طباعة البيانات المدخلة</option>
</select>

<h3>السؤال 15: ما نوع البيانات المستخدم لتخزين حرف مثل 'A'؟</h3>
<label for="answer15">اختر الإجابة:</label>
<select name="answer15" id="answer15" required>
  <option value="">اختر الإجابة</option>
  <option value="1">int</option>
  <option value="2">float</option>
  <option value="3">char</option>
  <option value="4">double</option>
</select>


        <button type="submit">إرسال النتيجة</button>
      </form>
      <div class="footer">يرجى التأكد من الإجابات قبل الإرسال.</div>
    </div>
  </body>
</html>
  `);
});




// معالجة نتائج الاختبار
app.post('/submit-test', (req, res) => {
  const code = req.body.code;
  const {answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10, answer11, answer12, answer13, answer14, answer15 } = req.body;

  const students = readExcel();
  const student = students.find(s => s.Code == code);

  if (student) {
    // تحديث Grade1 بناءً على الإجابات
    let score = 0;
    if (answer1 === '2') score++; // السؤال 1: الإجابة الصحيحة هي 1
    if (answer2 === '3') score++; // السؤال 2: الإجابة الصحيحة هي 2
    if (answer3 === '2') score++; // السؤال 3: الإجابة الصحيحة هي 3
    if (answer4 === '2') score++; // السؤال 4: الإجابة الصحيحة هي 1
    if (answer5 === '3') score++; // السؤال 5: الإجابة الصحيحة هي 2
    if (answer6 === '2') score++; // السؤال 6: الإجابة الصحيحة هي 3
    if (answer7 === '3') score++; // السؤال 7: الإجابة الصحيحة هي 1
    if (answer8 === '2') score++; // السؤال 8: الإجابة الصحيحة هي 2
    if (answer9 === '2') score++; // السؤال 9: الإجابة الصحيحة هي 3
    if (answer10 === '1') score++; // السؤال 10: الإجابة الصحيحة هي 1
    if (answer11 === '2') score++; // السؤال 11: الإجابة الصحيحة هي 2
    if (answer12 === '2') score++; // السؤال 12: الإجابة الصحيحة هي 3
    if (answer13 === '2') score++; // السؤال 13: الإجابة الصحيحة هي 1
    if (answer14 === '1') score++; // السؤال 14: الإجابة الصحيحة هي 2
    if (answer15 === '3') score++; // السؤال 15: الإجابة الصحيحة هي 3

    
    student.Grade1 = score; // تحديث نتيجة الاختبار
    writeExcel(students); // كتابة البيانات الجديدة في الإكسل

    res.redirect("/student");
  } else {
    res.send(`
      <html>
        <head>
          <title>خطأ</title>
        </head>
        <body>
          <h1>خطأ</h1>
          <p>لا يوجد بيانات لهذا المتدرب</p>
          <a href="/">رجوع</a>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
