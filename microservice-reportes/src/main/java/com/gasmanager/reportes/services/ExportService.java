package com.gasmanager.reportes.services;

// DTOs
import com.gasmanager.reportes.dto.*;

// Lombok
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

// Apache POI (Excel)
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

// iTextPDF (PDF) - Usar clases completas para evitar conflicto
import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Element;
import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

// Spring
import org.springframework.stereotype.Service;

// Java estándar
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExportService {

    private final ReporteService reporteService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    // ========== EXPORTAR VENTAS A EXCEL ==========

    public byte[] exportarVentasExcel(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.info("Exportando ventas a Excel");

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .build();

        List<ReporteVentasDTO> ventas = reporteService.getReporteVentas(filtros);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte de Ventas");

            // Crear estilo para encabezados
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Crear fila de encabezados
            String[] columnas = {"ID", "Folio", "Fecha", "Estado", "Método Pago", "Subtotal", "IVA", "Total", "Despachador", "Cliente", "Turno", "Facturada"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            // Llenar datos
            int rowNum = 1;
            for (ReporteVentasDTO v : ventas) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(v.getId());
                row.createCell(1).setCellValue(v.getFolio() != null ? v.getFolio() : "");
                row.createCell(2).setCellValue(v.getFechaHora() != null ? v.getFechaHora().format(DATE_FORMATTER) : "");
                row.createCell(3).setCellValue(v.getEstado() != null ? v.getEstado() : "");
                row.createCell(4).setCellValue(v.getMetodoPago() != null ? v.getMetodoPago() : "");
                row.createCell(5).setCellValue(v.getSubtotal() != null ? v.getSubtotal().doubleValue() : 0);
                row.createCell(6).setCellValue(v.getIva() != null ? v.getIva().doubleValue() : 0);
                row.createCell(7).setCellValue(v.getTotal() != null ? v.getTotal().doubleValue() : 0);
                row.createCell(8).setCellValue(v.getDespachadorNombre() != null ? v.getDespachadorNombre() : "");
                row.createCell(9).setCellValue(v.getClienteNombre() != null ? v.getClienteNombre() : "");
                row.createCell(10).setCellValue(v.getTurnoNombre() != null ? v.getTurnoNombre() : "");
                row.createCell(11).setCellValue(v.getFacturada() != null && v.getFacturada() ? "Sí" : "No");
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando ventas a Excel: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR VENTAS A PDF ==========

    public byte[] exportarVentasPdf(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.info("Exportando ventas a PDF");

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .build();

        List<ReporteVentasDTO> ventas = reporteService.getReporteVentas(filtros);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            // Título
            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Reporte de Ventas", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Fecha del reporte
            com.itextpdf.text.Font dateFont = FontFactory.getFont(FontFactory.HELVETICA, 10);
            document.add(new Paragraph("Generado: " + LocalDateTime.now().format(DATE_FORMATTER), dateFont));
            document.add(new Paragraph(" "));

            // Tabla
            PdfPTable table = new PdfPTable(10);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);

            // Encabezados
            String[] headers = {"Folio", "Fecha", "Estado", "Método", "Subtotal", "IVA", "Total", "Despachador", "Cliente", "Facturada"};
            for (String header : headers) {
                com.itextpdf.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Datos
            for (ReporteVentasDTO v : ventas) {
                com.itextpdf.text.Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
                table.addCell(new PdfPCell(new Paragraph(v.getFolio() != null ? v.getFolio() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(v.getFechaHora() != null ? v.getFechaHora().format(DATE_FORMATTER) : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(v.getEstado() != null ? v.getEstado() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(v.getMetodoPago() != null ? v.getMetodoPago() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (v.getSubtotal() != null ? v.getSubtotal().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (v.getIva() != null ? v.getIva().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (v.getTotal() != null ? v.getTotal().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph(v.getDespachadorNombre() != null ? v.getDespachadorNombre() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(v.getClienteNombre() != null ? v.getClienteNombre() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(v.getFacturada() != null && v.getFacturada() ? "Sí" : "No", dataFont)));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando ventas a PDF: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR INVENTARIO A EXCEL ==========

    public byte[] exportarInventarioExcel() {
        log.info("Exportando inventario a Excel");
        List<ReporteInventarioDTO> inventario = reporteService.getReporteInventario();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte de Inventario");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columnas = {"ID", "Tipo", "Nombre", "Stock Actual", "Capacidad", "Porcentaje", "Estado"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (ReporteInventarioDTO item : inventario) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(item.getId() != null ? item.getId() : 0);
                row.createCell(1).setCellValue(item.getTipoCombustible() != null ? item.getTipoCombustible() : "");
                row.createCell(2).setCellValue(item.getNombre() != null ? item.getNombre() : "");
                row.createCell(3).setCellValue(item.getStockActual() != null ? item.getStockActual().doubleValue() : 0);
                row.createCell(4).setCellValue(item.getCapacidadTanque() != null ? item.getCapacidadTanque().doubleValue() : 0);
                row.createCell(5).setCellValue(item.getPorcentajeOcupacion() != null ? item.getPorcentajeOcupacion().doubleValue() + "%" : "0%");
                row.createCell(6).setCellValue(item.getActivo() != null && item.getActivo() ? "Activo" : "Inactivo");
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando inventario a Excel: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR INVENTARIO A PDF ==========

    public byte[] exportarInventarioPdf() {
        log.info("Exportando inventario a PDF");
        List<ReporteInventarioDTO> inventario = reporteService.getReporteInventario();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Reporte de Inventario de Combustibles", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Generado: " + LocalDateTime.now().format(DATE_FORMATTER)));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);

            String[] headers = {"ID", "Tipo", "Nombre", "Stock Actual", "Capacidad", "Porcentaje", "Estado"};
            for (String header : headers) {
                com.itextpdf.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (ReporteInventarioDTO item : inventario) {
                com.itextpdf.text.Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
                table.addCell(new PdfPCell(new Paragraph(item.getId() != null ? item.getId().toString() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(item.getTipoCombustible() != null ? item.getTipoCombustible() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(item.getNombre() != null ? item.getNombre() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(item.getStockActual() != null ? item.getStockActual().toString() : "0", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(item.getCapacidadTanque() != null ? item.getCapacidadTanque().toString() : "0", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(item.getPorcentajeOcupacion() != null ? item.getPorcentajeOcupacion() + "%" : "0%", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(item.getActivo() ? "Activo" : "Inactivo", dataFont)));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando inventario a PDF: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR FACTURACIÓN A EXCEL ==========

    public byte[] exportarFacturacionExcel(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.info("Exportando facturación a Excel");

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .build();

        List<ReporteFacturacionDTO> facturas = reporteService.getReporteFacturacion(filtros);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte de Facturación");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columnas = {"ID", "Folio", "UUID", "Cliente", "RFC", "Fecha Emisión", "Subtotal", "IVA", "Total", "Estado"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (ReporteFacturacionDTO f : facturas) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(f.getId());
                row.createCell(1).setCellValue(f.getFolioFactura() != null ? f.getFolioFactura() : "");
                row.createCell(2).setCellValue(f.getUuidCfdi() != null ? f.getUuidCfdi() : "");
                row.createCell(3).setCellValue(f.getClienteNombre() != null ? f.getClienteNombre() : "");
                row.createCell(4).setCellValue(f.getClienteRfc() != null ? f.getClienteRfc() : "");
                row.createCell(5).setCellValue(f.getFechaEmision() != null ? f.getFechaEmision().format(DATE_FORMATTER) : "");
                row.createCell(6).setCellValue(f.getSubtotal() != null ? f.getSubtotal().doubleValue() : 0);
                row.createCell(7).setCellValue(f.getIva() != null ? f.getIva().doubleValue() : 0);
                row.createCell(8).setCellValue(f.getTotal() != null ? f.getTotal().doubleValue() : 0);
                row.createCell(9).setCellValue(f.getEstado() != null ? f.getEstado() : "");
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando facturación a Excel: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR FACTURACIÓN A PDF ==========

    public byte[] exportarFacturacionPdf(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.info("Exportando facturación a PDF");

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .build();

        List<ReporteFacturacionDTO> facturas = reporteService.getReporteFacturacion(filtros);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Reporte de Facturación", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Generado: " + LocalDateTime.now().format(DATE_FORMATTER)));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);

            String[] headers = {"Folio", "Cliente", "RFC", "Fecha Emisión", "Subtotal", "IVA", "Total", "Estado"};
            for (String header : headers) {
                com.itextpdf.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (ReporteFacturacionDTO f : facturas) {
                com.itextpdf.text.Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
                table.addCell(new PdfPCell(new Paragraph(f.getFolioFactura() != null ? f.getFolioFactura() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(f.getClienteNombre() != null ? f.getClienteNombre() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(f.getClienteRfc() != null ? f.getClienteRfc() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(f.getFechaEmision() != null ? f.getFechaEmision().format(DATE_FORMATTER) : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (f.getSubtotal() != null ? f.getSubtotal().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (f.getIva() != null ? f.getIva().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (f.getTotal() != null ? f.getTotal().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph(f.getEstado() != null ? f.getEstado() : "", dataFont)));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando facturación a PDF: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR CRÉDITOS A EXCEL ==========

    public byte[] exportarCreditosExcel() {
        log.info("Exportando créditos a Excel");
        List<ReporteCreditosDTO> creditos = reporteService.getReporteCreditos(null);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte de Créditos");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columnas = {"ID", "Folio", "Cliente", "RFC", "Monto Total", "Pagado", "Saldo", "Fecha Inicio", "Vencimiento", "Estado"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (ReporteCreditosDTO c : creditos) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(c.getId());
                row.createCell(1).setCellValue(c.getFolioCredito() != null ? c.getFolioCredito() : "");
                row.createCell(2).setCellValue(c.getClienteNombre() != null ? c.getClienteNombre() : "");
                row.createCell(3).setCellValue(c.getClienteRfc() != null ? c.getClienteRfc() : "");
                row.createCell(4).setCellValue(c.getMontoTotal() != null ? c.getMontoTotal().doubleValue() : 0);
                row.createCell(5).setCellValue(c.getMontoPagado() != null ? c.getMontoPagado().doubleValue() : 0);
                row.createCell(6).setCellValue(c.getSaldoPendiente() != null ? c.getSaldoPendiente().doubleValue() : 0);
                row.createCell(7).setCellValue(c.getFechaInicio() != null ? c.getFechaInicio().toString() : "");
                row.createCell(8).setCellValue(c.getFechaVencimiento() != null ? c.getFechaVencimiento().toString() : "");
                row.createCell(9).setCellValue(c.getEstado() != null ? c.getEstado() : "");
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando créditos a Excel: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR CRÉDITOS A PDF ==========

    public byte[] exportarCreditosPdf() {
        log.info("Exportando créditos a PDF");
        List<ReporteCreditosDTO> creditos = reporteService.getReporteCreditos(null);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Reporte de Créditos", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Generado: " + LocalDateTime.now().format(DATE_FORMATTER)));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);

            String[] headers = {"Folio", "Cliente", "Monto Total", "Pagado", "Saldo", "Fecha Inicio", "Vencimiento", "Estado"};
            for (String header : headers) {
                com.itextpdf.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (ReporteCreditosDTO c : creditos) {
                com.itextpdf.text.Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
                table.addCell(new PdfPCell(new Paragraph(c.getFolioCredito() != null ? c.getFolioCredito() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(c.getClienteNombre() != null ? c.getClienteNombre() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (c.getMontoTotal() != null ? c.getMontoTotal().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (c.getMontoPagado() != null ? c.getMontoPagado().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (c.getSaldoPendiente() != null ? c.getSaldoPendiente().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph(c.getFechaInicio() != null ? c.getFechaInicio().toString() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(c.getFechaVencimiento() != null ? c.getFechaVencimiento().toString() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(c.getEstado() != null ? c.getEstado() : "", dataFont)));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando créditos a PDF: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR NÓMINA A EXCEL ==========

    public byte[] exportarNominaExcel(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.info("Exportando nómina a Excel");

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .build();

        List<ReporteNominaDTO> nominas = reporteService.getReporteNomina(filtros);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte de Nómina");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columnas = {"Empleado", "Código", "Puesto", "Sueldo Base", "Horas Extras", "Bonos", "Faltas", "ISR", "Deducciones", "Neto", "Período"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (ReporteNominaDTO n : nominas) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(n.getEmpleadoNombre() != null ? n.getEmpleadoNombre() : "");
                row.createCell(1).setCellValue(n.getEmpleadoCodigo() != null ? n.getEmpleadoCodigo() : "");
                row.createCell(2).setCellValue(n.getPuestoNombre() != null ? n.getPuestoNombre() : "");
                row.createCell(3).setCellValue(n.getSueldoBase() != null ? n.getSueldoBase().doubleValue() : 0);
                row.createCell(4).setCellValue(n.getHorasExtrasMonto() != null ? n.getHorasExtrasMonto().doubleValue() : 0);
                row.createCell(5).setCellValue(n.getBonos() != null ? n.getBonos().doubleValue() : 0);
                row.createCell(6).setCellValue(n.getFaltasDescuento() != null ? n.getFaltasDescuento().doubleValue() : 0);
                row.createCell(7).setCellValue(n.getIsr() != null ? n.getIsr().doubleValue() : 0);
                row.createCell(8).setCellValue(n.getTotalDeducciones() != null ? n.getTotalDeducciones().doubleValue() : 0);
                row.createCell(9).setCellValue(n.getNetoPagar() != null ? n.getNetoPagar().doubleValue() : 0);
                row.createCell(10).setCellValue(n.getPeriodoInicio() != null ? n.getPeriodoInicio().toString() + " al " + n.getPeriodoFin() : "");
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando nómina a Excel: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR NÓMINA A PDF ==========

    public byte[] exportarNominaPdf(LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        log.info("Exportando nómina a PDF");

        FiltrosReporteDTO filtros = FiltrosReporteDTO.builder()
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .build();

        List<ReporteNominaDTO> nominas = reporteService.getReporteNomina(filtros);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Reporte de Nómina", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Generado: " + LocalDateTime.now().format(DATE_FORMATTER)));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(9);
            table.setWidthPercentage(100);

            String[] headers = {"Empleado", "Código", "Sueldo Base", "Horas Extras", "Bonos", "Faltas", "ISR", "Deducciones", "Neto"};
            for (String header : headers) {
                com.itextpdf.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (ReporteNominaDTO n : nominas) {
                com.itextpdf.text.Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
                table.addCell(new PdfPCell(new Paragraph(n.getEmpleadoNombre() != null ? n.getEmpleadoNombre() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(n.getEmpleadoCodigo() != null ? n.getEmpleadoCodigo() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (n.getSueldoBase() != null ? n.getSueldoBase().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (n.getHorasExtrasMonto() != null ? n.getHorasExtrasMonto().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (n.getBonos() != null ? n.getBonos().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (n.getFaltasDescuento() != null ? n.getFaltasDescuento().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (n.getIsr() != null ? n.getIsr().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (n.getTotalDeducciones() != null ? n.getTotalDeducciones().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (n.getNetoPagar() != null ? n.getNetoPagar().toString() : "0"), dataFont)));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando nómina a PDF: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR LEALTAD A EXCEL ==========

    public byte[] exportarLealtadExcel() {
        log.info("Exportando lealtad a Excel");
        List<ReporteLealtadDTO> clientes = reporteService.getReporteLealtad();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Reporte de Lealtad");

            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            String[] columnas = {"ID Cliente", "Cliente", "RFC", "Compras", "Total Gastado", "Puntos Acumulados", "Puntos Canjeados", "Puntos Disponibles"};
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columnas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columnas[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (ReporteLealtadDTO c : clientes) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(c.getClienteId());
                row.createCell(1).setCellValue(c.getClienteNombre() != null ? c.getClienteNombre() : "");
                row.createCell(2).setCellValue(c.getClienteRfc() != null ? c.getClienteRfc() : "");
                row.createCell(3).setCellValue(c.getNumeroCompras());
                row.createCell(4).setCellValue(c.getTotalCompras() != null ? c.getTotalCompras().doubleValue() : 0);
                row.createCell(5).setCellValue(c.getPuntosAcumulados());
                row.createCell(6).setCellValue(c.getPuntosCanjeados());
                row.createCell(7).setCellValue(c.getPuntosDisponibles());
            }

            for (int i = 0; i < columnas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando lealtad a Excel: {}", e.getMessage());
            return new byte[0];
        }
    }

    // ========== EXPORTAR LEALTAD A PDF ==========

    public byte[] exportarLealtadPdf() {
        log.info("Exportando lealtad a PDF");
        List<ReporteLealtadDTO> clientes = reporteService.getReporteLealtad();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            com.itextpdf.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("Reporte de Programa de Lealtad", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Generado: " + LocalDateTime.now().format(DATE_FORMATTER)));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(7);
            table.setWidthPercentage(100);

            String[] headers = {"Cliente", "RFC", "Compras", "Total Gastado", "Puntos Acumulados", "Puntos Canjeados", "Puntos Disponibles"};
            for (String header : headers) {
                com.itextpdf.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
                PdfPCell cell = new PdfPCell(new Paragraph(header, headerFont));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (ReporteLealtadDTO c : clientes) {
                com.itextpdf.text.Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 9);
                table.addCell(new PdfPCell(new Paragraph(c.getClienteNombre() != null ? c.getClienteNombre() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(c.getClienteRfc() != null ? c.getClienteRfc() : "", dataFont)));
                table.addCell(new PdfPCell(new Paragraph(String.valueOf(c.getNumeroCompras()), dataFont)));
                table.addCell(new PdfPCell(new Paragraph("$" + (c.getTotalCompras() != null ? c.getTotalCompras().toString() : "0"), dataFont)));
                table.addCell(new PdfPCell(new Paragraph(String.valueOf(c.getPuntosAcumulados()), dataFont)));
                table.addCell(new PdfPCell(new Paragraph(String.valueOf(c.getPuntosCanjeados()), dataFont)));
                table.addCell(new PdfPCell(new Paragraph(String.valueOf(c.getPuntosDisponibles()), dataFont)));
            }

            document.add(table);
            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error exportando lealtad a PDF: {}", e.getMessage());
            return new byte[0];
        }
    }
    // ========== METODO AUXILIAR PARA FORMATEAR FECHAS ==========
    // Agregar al final de la clase ExportService.java

    private String formatDate(LocalDateTime date) {
        if (date == null) return "";
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }

    private String formatDate(LocalDate date) {
        if (date == null) return "";
        return date.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
}