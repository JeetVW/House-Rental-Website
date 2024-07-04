from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv('DATABASE_URL')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
db = SQLAlchemy(app)

class HouseProperty(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.Text)
    bedrooms = db.Column(db.Integer)
    bathrooms = db.Column(db.Integer)
    area = db.Column(db.Numeric)
    available = db.Column(db.Boolean, default=True)

@app.route('/properties', methods=['GET'])
def get_properties():
    properties = HouseProperty.query.all()
    return jsonify([{
        'id': prop.id,
        'address': prop.address,
        'price': str(prop.price),
        'description': prop.description,
        'image_url': prop.image_url,
        'bedrooms': prop.bedrooms,
        'bathrooms': prop.bathrooms,
        'area': str(prop.area),
        'available': prop.available
    } for prop in properties])

if __name__ == '__main__':
    app.run(debug=True)
