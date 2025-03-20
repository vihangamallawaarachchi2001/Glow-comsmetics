
// cron.schedule('0 * * * *', () => {
//   Product.find().then(products => {
//     products.forEach(product => {
//       handleStockReplenishment(product._id);
//     });
//   });
// });

// cron.schedule('0 0 1 * *', () => {
//   Product.find().then(products => {
//     products.forEach(product => {
//       predictNextMonthSales(product._id);
//     });
//   });
// });

// cron.schedule("* * * * *", async () => {
//   try {
//     const products = await Order.find();

//     // await Order.deleteMany({
//     //   _id: { $in: products.map(product => product.userId !== '67d9ca42fd7c17321afe0a41') }
//     // });

//     products.map( async (order) => {
//       if ( order.userId !== 'products') {
//         await Order.findByIdAndDelete(order._id)
//         console.log(order.userId, order._id);
        
//       }
//     })

//     console.log(`${products.length} products deleted.`);
//   } catch (error) {
//     console.error('Error deleting products:', error);
//   }
// });
// Server activation