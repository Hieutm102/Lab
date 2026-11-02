
// BÀI 2: XỬ LÝ DANH SÁCH BẰNG MẢNG

// 1. Calculate average score
export function diemTrungBinh(ds) {
    if (ds.length === 0) {
        return 0;
    }

    return ds.reduce((tong, sv) => tong + sv.score, 0) / ds.length;
}

// 2. Get names and sort in Vietnamese
export function layTen(ds) {
    return ds
        .map(sv => sv.name)
        .toSorted((a, b) => a.localeCompare(b, 'vi'));
}

// 3. Classify students
export function xepLoai(diem) {
    if (diem >= 8) {
        return 'Giỏi';
    } else if (diem >= 6.5) {
        return 'Khá';
    } else if (diem >= 5) {
        return 'Trung bình';
    } else {
        return 'Yếu';
    }
}

// 4. Group students by class
export function nhomTheoLop(ds) {
    return ds.reduce((nhom, sv) => {
        if (!nhom[sv.class]) {
            nhom[sv.class] = [];
        }

        nhom[sv.class].push(sv);

        return nhom;
    }, {});
}

// 5. Get top N students
export function top(ds, n) {
    return ds
        .toSorted((a, b) =>
            b.score - a.score ||
            a.name.localeCompare(b.name, 'vi')
        )
        .slice(0, n);
}
