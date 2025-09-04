const { pool } = require('../db')

async function seed() {
  try {
    const products = [
      {
        id: 'club',
        name: 'คลับแซนวิช',
        description: 'ขนมปังปิ้งกรอบ ไข่ แฮม ชีส ผักสด ซอสสูตรพิเศษ',
        price: 139,
        image:
          'https://images.unsplash.com/photo-1603048689770-3b8a0c52b7ae?q=80&w=1887&auto=format&fit=crop',
        badge: 'ขายดี',
      },
      {
        id: 'chicken',
        name: 'แซนวิชไก่ย่าง',
        description: 'อกไก่ย่างซูวีฉ่ำๆ อาโวคาโด ผักสด และซอสสไปซี่มายองเนส',
        price: 149,
        image:
          'https://images.unsplash.com/photo-1553909489-cd47e0907980?q=80&w=1887&auto=format&fit=crop',
      },
      {
        id: 'tuna',
        name: 'แซนวิชทูน่า',
        description: 'ทูน่าคุณภาพ คลุกซอสไลท์มายองเนส แตงกวา และผักสลัด',
        price: 119,
        image:
          'https://images.unsplash.com/photo-1550317138-10000687a72b?q=80&w=1887&auto=format&fit=crop',
      },
      {
        id: 'ham-cheese',
        name: 'แฮมชีสคลาสสิก',
        description: 'แฮมรมควัน ชีสเชดด้าร์ ขนมปังโฮลวีต อบใหม่ทุกวัน',
        price: 109,
        image:
          'https://images.unsplash.com/photo-1576402187878-974f70c890a5?q=80&w=1887&auto=format&fit=crop',
      },
      {
        id: 'veggie',
        name: 'ผักอะโวคาโด',
        description: 'อะโวคาโดสุกพอดี มะเขือเทศ ผักสลัด และซอสบัลซามิก',
        price: 129,
        image:
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1887&auto=format&fit=crop',
        badge: 'เพื่อสุขภาพ',
      },
      {
        id: 'egg',
        name: 'ไข่ลาวาชีส',
        description: 'ไข่ลาวาหอมมัน ชีสเยิ้มๆ เสิร์ฟบนขนมปังกรอบ',
        price: 125,
        image:
          'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1887&auto=format&fit=crop',
      },
    ]

    for (const p of products) {
      await pool.query(
        'INSERT INTO products (id, name, description, price, image, badge) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), price=VALUES(price), image=VALUES(image), badge=VALUES(badge) ',
        [p.id, p.name, p.description || null, p.price, p.image || null, p.badge || null]
      )
    }

    console.log('Seed completed')
    process.exit(0)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seed()
