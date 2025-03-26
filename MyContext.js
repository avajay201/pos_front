import React, { createContext, useState } from 'react';

export const MainContext = createContext(null);

export const MainProvider = ({ children }) => {
    const [cart, setCart] = useState({});
    const [language, setLanguage] = useState('English');
    const languages = ['English', 'العربية'];
    const languageData = {
        home: {
            English: 'Subjects',
            العربية: 'المواضيع',
        },
        teachers: {
            English: 'Teachers',
            العربية: 'المعلمين',
        },
        grades: {
            English: 'Grades',
            العربية: 'الدرجات',
        },
        courses: {
            English: 'Courses',
            العربية: 'الدورات',
        },
        add2cart: {
            English: 'Add to Cart',
            العربية: 'أضف إلى السلة',
        },
        go2cart: {
            English: 'Go to Cart',
            العربية: 'اذهب إلى سلة التسوق',
        },
        cart: {
            English: 'Cart',
            العربية: 'عربة',
        },
        process2checkout: {
            English: 'Proceed to Checkout',
            العربية: 'الشروع في الخروج',
        },
        checkout: {
            English: 'Checkout',
            العربية: 'الدفع',
        },
        cart_summary: {
            English: 'Cart Summary',
            العربية: 'ملخص سلة التسوق',
        },
        buyer_details: {
            English: 'Buyer Details',
            العربية: 'تفاصيل المشتري',
        },
        total_courses: {
            English: 'Total Courses',
            العربية: 'إجمالي الدورات',
        },
        total_amount: {
            English: 'Total Amount',
            العربية: 'المبلغ الإجمالي',
        },
        proceed: {
            English: 'Proceed',
            العربية: 'يتابع',
        },
        student_name: {
            English: 'Student Name',
            العربية: 'اسم الطالب',
        },
        address: {
            English: 'Address',
            العربية: 'عنوان',
        },
        whatsapp_number: {
            English: 'Whatsapp Number',
            العربية: 'رقم واتس اب',
        },
        no_subjects: {
            English: 'No subjects available',
            العربية: 'لا توجد مواضيع متاحة',
        },
        no_teachers: {
            English: 'No teachers available',
            العربية: 'لا يوجد معلمون متاحون',
        },
        no_grades: {
            English: 'No grades available',
            العربية: 'لا توجد درجات متاحة',
        },
        no_courses: {
            English: 'No courses available',
            العربية: 'لا توجد دورات متاحة',
        },
        price: {
            English: 'Price',
            العربية: 'سعر',
        },
        cart_empty: {
            English: 'Your cart is empty',
            العربية: 'سلة التسوق الخاصة بك فارغة',
        },
    };

    return (
        <MainContext.Provider value={{ cart, setCart, languages, language, setLanguage, languageData }}>
            {children}
        </MainContext.Provider>
    );
};