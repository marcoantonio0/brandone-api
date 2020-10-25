import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    public registerEmail(to, name): void {
      this
        .mailerService
        .sendMail({
          to: to,
          from: 'noreply@brandone.com.br',
          subject: 'Bem-vindo a Brandone!',
          template: 'register', 
          context: {  
            name: name,
          },
        })
        .then((success) => {
          console.log(`Email enviado para: ${success.envelope.to}`)
        })
        .catch((err) => {
          console.log(err)
        });
    }

    public budgetEmail(to, data): void {
      this
        .mailerService
        .sendMail({
          to: to,
          from: 'noreply@brandone.com.br',
          subject: 'Projeto em andamento!',
          template: 'briefing', 
          context: {  
            title: data.title,
            price: data.price,
            deadline: data.deadline,
            status: data.status,
            name: data.customer.name,
            token: data.token
          },
        })
        .then((success) => {
          console.log(`Email enviado para: ${success.envelope.to}`)
        })
        .catch((err) => {
          console.log(err)
        });
    }


}
