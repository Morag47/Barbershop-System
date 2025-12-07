import Venta from '../models/Venta.js';
import PDFDocument from 'pdfkit';
import moment from 'moment-timezone';

const reportesController = {
  // Obtener reporte diario
  async obtenerReporteDiario(req, res) {
    try {
      const { fecha } = req.query;
      
      if (!fecha) {
        return res.status(400).json({ error: 'Fecha es requerida' });
      }

      const reporte = await Venta.reporteDiario(fecha);
      res.json(reporte);
    } catch (error) {
      console.error('Error al obtener reporte diario:', error);
      res.status(500).json({ error: 'Error al obtener reporte diario' });
    }
  },

  // Obtener reporte semanal
  async obtenerReporteSemanal(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Fechas de inicio y fin son requeridas' });
      }

      const reporte = await Venta.reporteSemanal(fechaInicio, fechaFin);
      res.json(reporte);
    } catch (error) {
      console.error('Error al obtener reporte semanal:', error);
      res.status(500).json({ error: 'Error al obtener reporte semanal' });
    }
  },

  // Obtener reporte mensual
  async obtenerReporteMensual(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Fechas de inicio y fin son requeridas' });
      }

      const reporte = await Venta.reporteMensual(fechaInicio, fechaFin);
      res.json(reporte);
    } catch (error) {
      console.error('Error al obtener reporte mensual:', error);
      res.status(500).json({ error: 'Error al obtener reporte mensual' });
    }
  },

  // Generar PDF de reporte diario
  async generarPDFDiario(req, res) {
    try {
      const { fecha } = req.query;
      
      console.log('📄 Generando PDF diario para fecha:', fecha);
      
      if (!fecha) {
        return res.status(400).json({ error: 'Fecha es requerida' });
      }

      const reporte = await Venta.reporteDiario(fecha);
      const ventas = await Venta.obtenerPorFecha(fecha);
      
      console.log('📊 Datos del reporte:', {
        totalVentas: reporte.total.total_ventas,
        totalDinero: reporte.total.total_dinero,
        cantidadVentas: ventas.length
      });
      
      // Crear PDF
      const doc = new PDFDocument({ margin: 50 });
      
      // Headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-diario-${fecha}.pdf`);
      
      doc.pipe(res);
      
      console.log('✅ PDF iniciado, generando contenido...');

      // Título
      doc.fontSize(20).font('Helvetica-Bold').text('HIGHBURY BARBER', { align: 'center' });
      doc.fontSize(16).text('Reporte de Ventas Diarias', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).font('Helvetica').text(`Fecha: ${moment(fecha).format('DD/MM/YYYY')}`, { align: 'center' });
      doc.moveDown(2);

      // Resumen general
      doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Total de servicios: ${reporte.total.total_ventas || 0}`);
      doc.text(`Total de ingresos: $${Number(reporte.total.total_dinero || 0).toLocaleString('es-CO')} COP`);
      doc.moveDown(1.5);

      // Ventas por empleado
      doc.fontSize(14).font('Helvetica-Bold').text('Ventas por Empleado');
      doc.moveDown(0.5);
      
      if (reporte.porEmpleado.length > 0) {
        reporte.porEmpleado.forEach((emp) => {
          doc.fontSize(11).font('Helvetica-Bold').text(emp.empleado);
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Servicios: ${emp.cantidad_servicios} | Ganancia: $${Number(emp.total_ganado).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.3);
        });
      } else {
        doc.fontSize(10).font('Helvetica').text('No hay datos');
      }
      doc.moveDown(1.5);

      // Ventas por servicio
      doc.fontSize(14).font('Helvetica-Bold').text('Ventas por Servicio');
      doc.moveDown(0.5);
      
      if (reporte.porServicio.length > 0) {
        reporte.porServicio.forEach((srv) => {
          doc.fontSize(11).font('Helvetica-Bold').text(srv.servicio);
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Cantidad: ${srv.cantidad} | Total: $${Number(srv.total).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.3);
        });
      } else {
        doc.fontSize(10).font('Helvetica').text('No hay datos');
      }
      doc.moveDown(2);

      // Detalle de ventas
      if (ventas.length > 0) {
        doc.addPage();
        doc.fontSize(14).font('Helvetica-Bold').text('Detalle de Ventas');
        doc.moveDown(1);

        ventas.forEach((venta, index) => {
          doc.fontSize(10).font('Helvetica-Bold').text(`#${index + 1} - ${venta.servicio_nombre}`);
          doc.fontSize(9).font('Helvetica');
          doc.text(`Cliente: ${venta.cliente_nombre}`);
          doc.text(`Empleado: ${venta.empleado_nombre}`);
          doc.text(`Monto: $${Number(venta.monto).toLocaleString('es-CO')} COP`);
          doc.text(`Hora: ${moment(venta.creado_en).tz('America/Bogota').format('HH:mm')}`);
          doc.moveDown(0.8);
        });
      }

      // Footer
      doc.fontSize(8).font('Helvetica').text(
        `Generado el ${moment().tz('America/Bogota').format('DD/MM/YYYY HH:mm')}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      console.error('Error al generar PDF diario:', error);
      res.status(500).json({ error: 'Error al generar PDF' });
    }
  },

  // Generar PDF de reporte semanal
  async generarPDFSemanal(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Fechas son requeridas' });
      }

      const reporte = await Venta.reporteSemanal(fechaInicio, fechaFin);
      
      const doc = new PDFDocument({ margin: 50 });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-semanal-${fechaInicio}-${fechaFin}.pdf`);
      
      doc.pipe(res);

      // Título
      doc.fontSize(20).font('Helvetica-Bold').text('HIGHBURY BARBER', { align: 'center' });
      doc.fontSize(16).text('Reporte de Ventas Semanal', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).font('Helvetica').text(
        `Del ${moment(fechaInicio).format('DD/MM/YYYY')} al ${moment(fechaFin).format('DD/MM/YYYY')}`,
        { align: 'center' }
      );
      doc.moveDown(2);

      // Resumen general
      doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Total de servicios: ${reporte.total.total_ventas || 0}`);
      doc.text(`Total de ingresos: $${Number(reporte.total.total_dinero || 0).toLocaleString('es-CO')} COP`);
      doc.moveDown(1.5);

      // Ventas por día
      doc.fontSize(14).font('Helvetica-Bold').text('Ventas por Día');
      doc.moveDown(0.5);
      
      if (reporte.porDia.length > 0) {
        reporte.porDia.forEach((dia) => {
          doc.fontSize(11).font('Helvetica-Bold').text(moment(dia.fecha).format('dddd DD/MM/YYYY'));
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Servicios: ${dia.total_ventas} | Ingresos: $${Number(dia.total_dinero).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.3);
        });
        
        // Encontrar mejor y peor día
        const mejorDia = reporte.porDia.reduce((max, dia) => 
          Number(dia.total_dinero) > Number(max.total_dinero) ? dia : max
        , reporte.porDia[0]);
        
        doc.moveDown(1);
        doc.fontSize(11).font('Helvetica-Bold').fillColor('#d4af37').text('Mejor día: ');
        doc.font('Helvetica').fillColor('#000000').text(
          `${moment(mejorDia.fecha).format('dddd DD/MM')} con $${Number(mejorDia.total_dinero).toLocaleString('es-CO')} COP`
        );
      } else {
        doc.fontSize(10).font('Helvetica').text('No hay datos');
      }
      doc.moveDown(1.5);

      // Ventas por empleado
      doc.fontSize(14).font('Helvetica-Bold').text('Ventas por Empleado');
      doc.moveDown(0.5);
      
      if (reporte.porEmpleado.length > 0) {
        reporte.porEmpleado.forEach((emp) => {
          doc.fontSize(11).font('Helvetica-Bold').text(emp.empleado);
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Servicios: ${emp.cantidad_servicios} | Ganancia: $${Number(emp.total_ganado).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.3);
        });
      } else {
        doc.fontSize(10).font('Helvetica').text('No hay datos');
      }
      doc.moveDown(1.5);

      // Ventas por empleado
      doc.fontSize(14).font('Helvetica-Bold').text('Ventas por Empleado');
      doc.moveDown(0.5);
      
      if (reporte.porEmpleado.length > 0) {
        reporte.porEmpleado.forEach((emp) => {
          doc.fontSize(11).font('Helvetica-Bold').text(emp.empleado);
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Servicios: ${emp.cantidad_servicios} | Ganancia: $${Number(emp.total_ganado).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.3);
        });
      } else {
        doc.fontSize(10).font('Helvetica').text('No hay datos');
      }
      doc.moveDown(1.5);

      // Detalle de ventas por día
      if (reporte.porDia.length > 0) {
        doc.addPage();
        doc.fontSize(14).font('Helvetica-Bold').text('Detalle de Ventas por Día');
        doc.moveDown(1);

        reporte.porDia.forEach((dia) => {
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#d4af37').text(
            moment(dia.fecha).format('dddd DD/MM/YYYY')
          );
          doc.fillColor('#000000');
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Servicios realizados: ${dia.total_ventas}`);
          doc.text(`  Ingresos del día: $${Number(dia.total_dinero).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.5);
        });
      }

      // Footer
      doc.fontSize(8).font('Helvetica').text(
        `Generado el ${moment().tz('America/Bogota').format('DD/MM/YYYY HH:mm')}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      console.error('Error al generar PDF semanal:', error);
      res.status(500).json({ error: 'Error al generar PDF' });
    }
  },

  // Generar PDF de reporte mensual
  async generarPDFMensual(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: 'Fechas son requeridas' });
      }

      const reporte = await Venta.reporteMensual(fechaInicio, fechaFin);
      
      const doc = new PDFDocument({ margin: 50 });
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=reporte-mensual-${fechaInicio}-${fechaFin}.pdf`);
      
      doc.pipe(res);

      // Título
      doc.fontSize(20).font('Helvetica-Bold').text('HIGHBURY BARBER', { align: 'center' });
      doc.fontSize(16).text('Reporte de Ventas Mensual', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).font('Helvetica').text(
        `Del ${moment(fechaInicio).format('DD/MM/YYYY')} al ${moment(fechaFin).format('DD/MM/YYYY')}`,
        { align: 'center' }
      );
      doc.moveDown(2);

      // Resumen general
      doc.fontSize(14).font('Helvetica-Bold').text('Resumen General');
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica');
      doc.text(`Total de servicios: ${reporte.total.total_ventas || 0}`);
      doc.text(`Total de ingresos: $${Number(reporte.total.total_dinero || 0).toLocaleString('es-CO')} COP`);
      doc.text(`Promedio diario: $${(Number(reporte.total.total_dinero || 0) / reporte.porDia.length).toFixed(0).toLocaleString('es-CO')} COP`);
      doc.moveDown(1.5);

      // Ventas por día (resumido - top 5 y bottom 5)
      doc.fontSize(14).font('Helvetica-Bold').text('Análisis por Día');
      doc.moveDown(0.5);
      
      if (reporte.porDia.length > 0) {
        const sorted = [...reporte.porDia].sort((a, b) => Number(b.total_dinero) - Number(a.total_dinero));
        
        doc.fontSize(12).font('Helvetica-Bold').fillColor('#d4af37').text('Top 5 Mejores Días:');
        doc.fillColor('#000000');
        sorted.slice(0, 5).forEach((dia, i) => {
          doc.fontSize(10).font('Helvetica');
          doc.text(`${i + 1}. ${moment(dia.fecha).format('DD/MM')} - $${Number(dia.total_dinero).toLocaleString('es-CO')} COP (${dia.total_ventas} servicios)`);
        });
        
        doc.moveDown(1);
        doc.fontSize(12).font('Helvetica-Bold').text('Días con Menos Ventas:');
        sorted.slice(-5).reverse().forEach((dia, i) => {
          doc.fontSize(10).font('Helvetica');
          doc.text(`${i + 1}. ${moment(dia.fecha).format('DD/MM')} - $${Number(dia.total_dinero).toLocaleString('es-CO')} COP (${dia.total_ventas} servicios)`);
        });
      }
      doc.moveDown(1.5);

      // Ventas por empleado
      doc.fontSize(14).font('Helvetica-Bold').text('Ventas por Empleado');
      doc.moveDown(0.5);
      
      if (reporte.porEmpleado.length > 0) {
        reporte.porEmpleado.forEach((emp, i) => {
          doc.fontSize(11).font('Helvetica-Bold').text(`${i + 1}. ${emp.empleado}`);
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Servicios: ${emp.cantidad_servicios} | Ganancia: $${Number(emp.total_ganado).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.3);
        });
      }
      doc.moveDown(1.5);

      // Ventas por servicio
      doc.fontSize(14).font('Helvetica-Bold').text('Ventas por Servicio');
      doc.moveDown(0.5);
      
      if (reporte.porServicio.length > 0) {
        reporte.porServicio.forEach((srv, i) => {
          doc.fontSize(11).font('Helvetica-Bold').text(`${i + 1}. ${srv.servicio}`);
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Cantidad: ${srv.cantidad} | Total: $${Number(srv.total).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.3);
        });
      }
      doc.moveDown(1.5);

      // Detalle completo de ventas por día
      if (reporte.porDia.length > 0) {
        doc.addPage();
        doc.fontSize(14).font('Helvetica-Bold').text('Detalle Completo de Ventas por Día');
        doc.moveDown(1);

        reporte.porDia.forEach((dia) => {
          doc.fontSize(11).font('Helvetica-Bold').fillColor('#d4af37').text(
            moment(dia.fecha).format('dddd DD/MM/YYYY')
          );
          doc.fillColor('#000000');
          doc.fontSize(10).font('Helvetica');
          doc.text(`  Servicios realizados: ${dia.total_ventas}`);
          doc.text(`  Ingresos del día: $${Number(dia.total_dinero).toLocaleString('es-CO')} COP`);
          doc.moveDown(0.5);
        });
      }

      // Footer
      doc.fontSize(8).font('Helvetica').text(
        `Generado el ${moment().tz('America/Bogota').format('DD/MM/YYYY HH:mm')}`,
        50,
        doc.page.height - 50,
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      console.error('Error al generar PDF mensual:', error);
      res.status(500).json({ error: 'Error al generar PDF' });
    }
  }
};

export default reportesController;
