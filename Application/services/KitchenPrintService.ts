export class KitchenPrintService {
  static print(data: {
    tableName: string;
    dishName: string;
    note?: string;
  }) {
    // tạm thời log (sau này thay bằng máy in)
    console.log("=== IN BẾP ===");
    console.log("Bàn:", data.tableName);
    if (data.note) console.log("Ghi chú:", data.note);
    console.log("==============");
  }
}
