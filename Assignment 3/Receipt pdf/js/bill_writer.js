/*
 Copyright 2015 ClayFish Technologies LLP

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var billWriter = {
    version: '0.2.0',
    config: {
        companyName: "Read It",
        address: "Online Library",
        tin: "",
        serviceTax: '',
        contactNumber: '1234567890',
        currency: 'INR',
        terms: ["The members should inform the library their new designations, official addresses and addresses of communication as and when they move to new assignments or locations.",
            "All dues to the library must be paid on time.",
            "Circulating the copyrighted online issues of books is prohibited.",
            "Downloading or screenshoting books is not allowed",
            "This is a computer generated receipt and is not valid without authority signatures."],
        eAndOe: true,
        blank: false
    },

    generateBill: function (info) {
        if (info == undefined) {
            return;
        }

        pdfMake.fonts = {
            Ubuntu: {
                normal: 'Ubuntu-L.ttf',
                bold: 'Ubuntu-B.ttf',
                italics: 'Ubuntu-LI.ttf',
                bolditalics: 'Ubuntu-BI.ttf'
            }
        };

        var doc = {
            content: [],
            defaultStyle: {
                font: "Ubuntu"
            },
            styles: {
                title: {
                    fontSize: 30,
                    alignment: 'center',
                    bold: true,
                    color: '#333'
                },
                titleSmall: {
                    fontSize: 16,
                    alignment: 'center'
                },
                address: {
                    fontSize: 10,
                    alignment: 'center'
                },
                contact: {
                    fontSize: 8,
                    alignment: 'right'
                },
                tableHeader: {
                    fontSize: 10,
                    bold: true,
                    alignment: 'center'
                },
                money: {
                    alignment: 'right'
                },
                discount: {
                    alignment: 'right',
                    fontSize: 8
                },
                tax: {
                    alignment: 'right',
                    fontSize: 8
                },
                total: {
                    bold: true,
                    alignment: 'right'
                },
                term: {
                    fontSize: 6
                },
                termsHeading: {
                    fontSize: 8,
                    bold: true,
                    margin: [0, 50, 0, 0]
                },
                signature: {
                    color: '#333',
                    alignment: 'right',
                    margin: [0, 50, 0, 0]
                }
            }
        };
        //border(doc);
        doc = generateBillHeader(doc, info);
        doc = writeCustomerInfo(doc, info);
        doc = writeItems(doc, info);
        doc = writeTerms(doc);
        doc = writeFooter(doc);
        return doc;
    },

    download: function (doc, fileName, billDate) {
        if (fileName === undefined || fileName == null) {
            if (billDate === undefined) {
                billDate = new Date();
            }
            fileName = "Receipt_" + billDate.getFullYear() + (billDate.getMonth() + 1) + billDate.getDate();
        }

        pdfMake.createPdf(doc).download(fileName);
    }

};

var insertLine = function (doc, vertical) {
    if (vertical) {
        // FIXME Test the vertical line
        doc.content.push({
            table: {
                widths: ['*'],
                body: [[" "], [" "]]
            },
            layout: {
                hLineWidth: function () {
                    return 0;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 0 : 1;
                }
            }
        });
    } else {
        doc.content.push({
            table: {
                widths: ['*'],
                body: [[" "], [" "]]
            },
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 0 : 1;
                },
                vLineWidth: function () {
                    return 0;
                }
            }
        });
    }

    return doc;
};

var generateBillHeader = function (doc, info) {
    doc.content.push({
        alignment: 'center',
        columns: [{
            text: ''
        }, {
            text: 'Read It Receipt',
            style: 'titleSmall'
        }, {
            text: billWriter.config.contactNumber,
            style: 'contact'
        }]
    });

    doc.content.push({
        text: billWriter.config.companyName,
        style: 'title'
    });
    doc.content.push({
        text: billWriter.config.address,
        style: 'address'
    });

    if (billWriter.config.tin && billWriter.config.tin.length) {
        doc.content.push({
            text: 'TIN: ' + billWriter.config.tin,
            style: 'address'
        });
    }
    return insertLine(doc);
};

var border = function (doc) {
    // TODO Implement drawing a border
};

var writeCustomerInfo = function (doc, info) {
    var writeBlankCustomerInfo = function () {
        doc.content.push({
            text: 'M/s ___________________________________________________'
        });
        doc.content.push({
            text: '_______________________________________________________'
        });
        doc.content.push({
            text: 'TIN/PAN: ______________________________________________'
        });
        return doc;
    };

    if (billWriter.config.blank) {
        doc = writeBlankCustomerInfo();
    } else {
        var customerInfoBlock = {
            alignment: 'justify',
            columns: [{
                text: 'Receipt ID: ' + info.billNo + '\nDate: ' + utils.getDate(info.billDate)
            }, [{
                text: info.customer.name,
                bold: true
            }, {
                text: info.customer.address
            }]]
        };

        if (info.customer.pan && info.customer.pan.length) {
            customerInfoBlock.columns[1].push({
                text: "TIN/PAN: " + info.customer.pan
            });
        }

        doc.content.push(customerInfoBlock);
    }

    return insertLine(doc);
};

var writeItems = function (doc, info) {
    var tableObject = {
        layout: 'lightHorizontalLines',
        table: {
            headerRows: 1,
            widths: [25, 200, '*', 75, '*'],
            dontBreakRows: true,
            body: [[{
                text: "Sr",
                style: 'tableHeader'
            }, {
                text: 'Book Name',
                style: 'tableHeader'
            }, {
                text: 'Monthly Price',
                style: 'tableHeader'
            }, {
                text: 'No. of Months',
                style: 'tableHeader'
            }, {
                text: 'Amount',
                style: 'tableHeader'
            }]]
        }
    };

    if (billWriter.config.blank) {

    } else {
        for (var i in info.items.list) {
            var lineNumber = parseInt(i) + 1;
            tableObject.table.body.push([{
                text: lineNumber.toString(),
                alignment: 'center'
            }, {
                text: info.items.list[i].name
            }, {
                text: info.items.list[i].price,
                style: 'money'
            }, {
                text: info.items.list[i].unit,
                style: 'money'
            }, {
                text: info.items.list[i].amount,
                style: 'money'
            }]);
        }


        // Incorporating discount
        if (info.discount.available) {
            tableObject.table.body.push([
                {
                    colSpan: 4,
                    text: 'Total',
                    style: 'money'
                }, {}, {}, {},
                {
                    text: info.items.total,
                    style: 'money'
                }
            ]);

            tableObject.table.body.push([
                {
                    text: 'Discount (' + info.discount.percent + ')',
                    style: 'discount',
                    colSpan: 4
                }, {}, {}, {},
                {
                    text: info.discount.amount,
                    style: 'discount'
                }
            ]);
            tableObject.table.body.push([
                {
                    colSpan: 4,
                    text: 'Total',
                    style: 'total'
                }, {}, {}, {},
                {
                    text: info.discount.totalAfterDiscount,
                    style: 'total'
                }
            ]);
        } else {
            tableObject.table.body.push([
                {
                    colSpan: 4,
                    text: 'Total',
                    style: 'total'
                }, {}, {}, {},
                {
                    text: info.items.total,
                    style: 'total'
                }
            ]);
        }

        // Including taxes
        if (info.taxApplied) {
            for (i in info.taxes.list) {
                tableObject.table.body.push([{
                    text: info.taxes.list[i].name + ' (' + info.taxes.list[i].percent + ')',
                    style: 'tax',
                    colSpan: 4
                }, {}, {}, {}, {
                    text: info.taxes.list[i].amount,
                    style: 'tax'
                }]);
            }

            tableObject.table.body.push([{
                text: 'Total Payable amount',
                colSpan: 4,
                style: 'total'
            }, {}, {}, {}, {
                text: info.taxes.totalWithTaxes,
                style: 'total'
            }]);

        }

    }

    doc.content.push(tableObject);
    return doc;
};

var writeTerms = function (doc) {
    doc.content.push({
        text: 'Terms & Conditions',
        style: 'termsHeading'
    });

    var srNo;
    for (var i in billWriter.config.terms) {
        srNo = parseInt(i) + 1;
        doc.content.push({
            text: srNo + '. ' + billWriter.config.terms[i],
            style: 'term'
        });
    }

    if (billWriter.config.serviceTax && billWriter.config.serviceTax.length) {
        srNo++;
        doc.content.push({
            text: srNo + '. Service tax number: ' + billWriter.config.serviceTax,
            style: 'term'
        });
    }

    if (billWriter.config.eAndOe) {
        srNo++;
    }
    return doc;
};

var writeFooter = function (doc) {
    doc.content.push({
        text: 'For \n' + billWriter.config.companyName,
        style: 'signature'
    });
    return doc;
};
